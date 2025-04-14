/* ---------------------------------------------------------------------------
   11) fetchNetworkExcel Function
   - This is the helper that fetches Excel data from a network path
--------------------------------------------------------------------------- */

export async function fetchNetworkExcel(networkPath, username, password, executionId) {
  try {
    console.log(`Requesting Excel from network path: ${networkPath}`);
    console.log(`Execution ID: ${executionId}, Username: ${username}`);
    const SERVER_URL = 'http://localhost:3001'; // Adjust as needed
    const response = await fetch(`${SERVER_URL}/api/network-excel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: networkPath, username, password, executionId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server response:', errorData);
      throw new Error(errorData.error || `Failed to access network path: ${response.statusText}`);
    }
    const excelData = await response.json();
    console.log('Excel data received:', excelData);
    return excelData;
  } catch (error) {
    console.error('Error accessing network Excel:', error);
    throw error;
  }
}
