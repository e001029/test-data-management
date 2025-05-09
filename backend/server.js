const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to access Excel files from network shares
app.post('/api/network-excel', async (req, res) => {
  const { path: networkPath, username, password, executionId } = req.body;

  console.log(`Attempting to access: ${networkPath} for execution ID: ${executionId}`);

  try {
    // For Windows: Create a temporary network connection using the provided credentials
    const driveLetter = 'Y:';

    // Build the UNC path if it doesn't start with \\
    const uncPath = networkPath.startsWith('\\\\') ? networkPath : `\\\\${networkPath}`;

    // Map the network drive
    await mapNetworkDrive(driveLetter, uncPath, username, password);
    console.log(`Successfully mapped network drive ${driveLetter} to ${uncPath}`);

    // Construct path to the Excel file (fixed to SalesOrder1.xlsx)
    const excelFilePath = path.join(driveLetter, 'SalesOrder1.xlsx');

    console.log(`Attempting to read Excel file: ${excelFilePath}`);

    // Check if file exists
    if (!fs.existsSync(excelFilePath)) {
      throw new Error(`Excel file not found at: ${excelFilePath}`);
    }

    // Read and parse the Excel file
    const workbook = XLSX.readFile(excelFilePath);

    // Get list of all sheet names
    const sheetNames = workbook.SheetNames;

    // Get the Results sheet (case-insensitive search)
    const resultSheetName = sheetNames.find(name =>
      name.toLowerCase() === 'result' || name.toLowerCase() === 'results'
    );

    if (!resultSheetName) {
      throw new Error(`Result sheet not found in Excel file. Available sheets: ${sheetNames.join(', ')}`);
    }

    // Get the sheet data
    const resultsSheet = workbook.Sheets[resultSheetName];

    // Convert to JSON with raw cell values
    const jsonData = XLSX.utils.sheet_to_json(resultsSheet, { header: 1, defval: '' });

    if (jsonData.length < 2) {
      throw new Error('Result sheet does not contain enough data (requires at least one key-value pair)');
    }

    // Parse key-value pairs starting from the second row (A2)
    const headers = [];
    const rowObj = {};
    for (let i = 1; i < jsonData.length; i += 2) { // Start from index 1 (second row)
      const key = jsonData[i][0]?.toString().trim();
      const value = jsonData[i + 1]?.[0]?.toString().trim() || '';
      if (key) {
        headers.push(key);
        rowObj[key] = value;
      }
    }

    if (headers.length === 0) {
      throw new Error('No valid key-value pairs found in the Result sheet');
    }

    // Normalize headers and rowObj keys to ensure exact matches
    const expectedHeaders = ["SalesOrderNumber", "Current Date", "Lines", "Warning message in Configurator page"];
    const normalizedRowObj = {};
    expectedHeaders.forEach(header => {
      // Find the matching key in headers (case-insensitive, ignore spaces)
      const matchingKey = headers.find(h => h.toLowerCase().replace(/\s+/g, '') === header.toLowerCase().replace(/\s+/g, ''));
      normalizedRowObj[header] = matchingKey ? rowObj[matchingKey] || '' : '';
    });

    const rows = [normalizedRowObj];

    // Unmap the network drive
    try {
      await unmapNetworkDrive(driveLetter);
      console.log(`Successfully unmapped network drive ${driveLetter}`);
    } catch (unmapError) {
      console.warn(`Warning: Failed to unmap drive ${driveLetter}:`, unmapError.message);
    }

    // Log the data being sent
    console.log('Excel data sent:', { sheetName: resultSheetName, headers: expectedHeaders, rows });

    // Return the Excel data
    res.json({
      sheetName: resultSheetName,
      headers: expectedHeaders,
      rows: rows
    });

  } catch (error) {
    console.error("Error accessing network Excel:", error);

    // Try to unmap the drive in case of error
    try {
      await unmapNetworkDrive('Y:');
    } catch (unmapError) {
      console.warn("Warning: Failed to unmap drive during error handling:", unmapError.message);
    }

    res.status(500).json({
      error: error.message,
      details: `Failed to access Excel file from network path: ${networkPath}`
    });
  }
});

// Helper function to map network drive in Windows
async function mapNetworkDrive(driveLetter, networkPath, username, password) {
  try {
    // First disconnect any existing mapping for this drive letter
    try {
      await execPromise(`net use ${driveLetter} /delete /y`);
    } catch (e) {
      // Ignore errors if the drive wasn't mapped
    }

    // Map the network drive with credentials
    const command = `net use ${driveLetter} "${networkPath}" /user:${username} "${password}" /persistent:no`;
    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      throw new Error(`Error mapping network drive: ${stderr}`);
    }

    return stdout;
  } catch (error) {
    throw new Error(`Failed to map network drive: ${error.message}`);
  }
}

// Helper function to unmap network drive in Windows
async function unmapNetworkDrive(driveLetter) {
  try {
    const command = `net use ${driveLetter} /delete /y`;
    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      throw new Error(`Error unmapping network drive: ${stderr}`);
    }

    return stdout;
  } catch (error) {
    throw new Error(`Failed to unmap network drive: ${error.message}`);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Network file access server running on port ${PORT}`);
});
