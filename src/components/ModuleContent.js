// src/components/ModuleContent.js
// Note: This file contains JSX, ensure ESLint is configured with JSX parsing (see .eslintrc below)

import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  CardContent,
  Paper,
  Chip,
  Typography,
  Tabs,
  Tab,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Button,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DataObjectIcon from '@mui/icons-material/DataObject';
import StorageIcon from '@mui/icons-material/Storage';
import TuneIcon from '@mui/icons-material/Tune';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Configuration imports
import { moduleFields, moduleCategories } from '../config/moduleFields';
import { theme } from '../theme';

// Styled GlassCard for consistent, compact UI
const GlassCard = styled(Paper)(({ theme }) => ({
  background: '#FFFFFF',
  border: '1px solid #E0E0E0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  borderRadius: 6,
  transition: 'box-shadow 0.3s ease',
  height: '100%',
  '&:hover': { boxShadow: '0 4px 16px rgba(0,120,212,0.15)' },
}));

function ModuleContent({ activeModule, moduleFormInputs, setModuleFormInputs, moduleData, setModuleData, onBack }) {
  // Local state
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, rowIndex: -1 });
  const [tabValue, setTabValue] = React.useState(0);

  // Mapping to ToscaExecutionPanel.js TEST inputs
  const TEST_MAPPING = {
    'Order Creation': {
      id: 'Order_Creation',
      inputs: [{ name: 'eventName', label: 'Event Name' }]
    },
    'Caster Production': {
      id: 'Caster_Production',
      inputs: [
        { name: 'eventName', label: 'Event Name' },
        { name: 'PgId', label: 'Program ID' }
      ]
    },
    'Quality Validation': {
      id: 'Quality_Validation',
      inputs: [
        { name: 'eventName', label: 'Event Name' },
        { name: 'heatNumber', label: 'Heat Number' }
      ]
    },
    'Load Creation': {
      id: 'Load_Creation',
      inputs: [
        { name: 'eventName', label: 'Event Name' },
        { name: 'orderNumber', label: 'Order Number' },
        { name: 'customerNumber', label: 'Customer Number' }
      ]
    },
    'Shipping Process': {
      id: 'Shipping_Process',
      inputs: [
        { name: 'eventName', label: 'Event Name' },
        { name: 'orderNumber', label: 'Order Number' },
        { name: 'customerNumber', label: 'Customer Number' }
      ]
    }
  };

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const findCategoryForModule = (module) =>
    Object.entries(moduleCategories).find(([_, mods]) => mods.includes(module))?.[0] || 'Other';

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // Fields for the current module
  const fields = moduleFields[activeModule] || [];

  // Form fields with tight grid for Form View
  const renderFormFields = () => (
    <Grid container spacing={2}>
      {fields.map((field) => (
        <Grid key={field} item xs={12} sm={6} md={4}>
          <TextField
            label={field}
            variant="outlined"
            size="small"
            fullWidth
            disabled={field === 'Result=>' || field === 'Expected Sales Order Number'}
            value={moduleFormInputs[activeModule][field] || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            InputLabelProps={{ shrink: true, sx: { fontSize: '0.85rem' } }}
            sx={{ '& .MuiInputBase-root': { height: 36, fontSize: '0.85rem' } }}
          />
        </Grid>
      ))}
    </Grid>
  );

  const addRow = () => {
    const newRow = {
      ...moduleFormInputs[activeModule],
      createdAt: new Date().toLocaleString()
    };
    const hasData = Object.keys(newRow).some(k => newRow[k] && k !== 'createdAt');
    if (!hasData) {
      showSnackbar('Please enter at least one value before adding a row.', 'warning');
      return;
    }
    setModuleData(prev => ({
      ...prev,
      [activeModule]: [...(prev[activeModule] || []), newRow]
    }));
    setModuleFormInputs(prev => ({
      ...prev,
      [activeModule]: Object.fromEntries(fields.map(f => [f, '']))
    }));
    showSnackbar('Row added successfully');
  };

  const handleFieldChange = (fieldName, value) => {
    setModuleFormInputs(prev => ({
      ...prev,
      [activeModule]: { ...prev[activeModule], [fieldName]: value }
    }));
  };

  const handleCellEdit = (rowIndex, fieldName, value) => {
    setModuleData(prev => {
      const updatedRows = [...prev[activeModule]];
      updatedRows[rowIndex] = { ...updatedRows[rowIndex], [fieldName]: value };
      return { ...prev, [activeModule]: updatedRows };
    });
  };

  const copyRow = (rowIndex) => {
    setModuleData(prev => {
      const rows = [...prev[activeModule]];
      const rowToCopy = { ...rows[rowIndex], createdAt: new Date().toLocaleString() };
      rows.splice(rowIndex + 1, 0, rowToCopy);
      return { ...prev, [activeModule]: rows };
    });
    showSnackbar('Row copied successfully');
  };

  const handleDeleteRow = (rowIndex) => setDeleteDialog({ open: true, rowIndex });
  const confirmDeleteRow = () => {
    setModuleData(prev => {
      const updatedRows = [...prev[activeModule]];
      updatedRows.splice(deleteDialog.rowIndex, 1);
      return { ...prev, [activeModule]: updatedRows };
    });
    showSnackbar('Row deleted successfully');
    setDeleteDialog({ open: false, rowIndex: -1 });
  };

  const exportExcel = () => {
    const hasData = Object.values(moduleData).some(rows => rows.length > 0);
    if (!hasData) {
      showSnackbar('No data to export in any module', 'warning');
      return;
    }
    const wb = XLSX.utils.book_new();
    Object.entries(moduleData).forEach(([moduleName, rows]) => {
      if (!rows || rows.length === 0) return;
      const sheetData = rows.map(row => {
        const newRow = { ...row };
        delete newRow.createdAt;
        return newRow;
      });
      const ws = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, moduleName.length > 31 ? moduleName.substring(0, 31) : moduleName);
    });
    const excelBuf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `TestData_All_Modules_${new Date().toISOString().split('T')[0]}.xlsx`);
    showSnackbar('All module data exported to Excel successfully', 'success');
  };

  const rowsForActiveModule = moduleData[activeModule] || [];

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <GlassCard sx={{ mb: 2, mr: 0 }}>
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, pl: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                label={findCategoryForModule(activeModule)}
                color="primary"
                size="small"
                sx={{ mr: 1.5, backgroundColor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontSize: '0.8rem' }}
              />
              <Typography variant="h6" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                {activeModule}
              </Typography>
            </Box>
            <Box>
              <Tooltip title="Data has been modified" arrow>
                <Chip
                  icon={<DataObjectIcon fontSize="small" />}
                  label={rowsForActiveModule.length > 0 ? `${rowsForActiveModule.length} rows` : 'No data'}
                  size="small"
                  color={rowsForActiveModule.length > 0 ? 'success' : 'default'}
                  sx={{ mr: 1.5, fontSize: '0.8rem' }}
                />
              </Tooltip>
              <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack} size="small" sx={{ fontSize: '0.8rem', py: 0.5 }}>
                Back
              </Button>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ p: 0 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="module view tabs" sx={{ minHeight: 36 }}>
              <Tab label="Form View" icon={<TuneIcon fontSize="small" />} iconPosition="start" sx={{ fontSize: '0.70rem', minHeight: 36, px: 2 }} />
              <Tab label="Table View" icon={<StorageIcon fontSize="small" />} iconPosition="start" sx={{ fontSize: '0.70rem', minHeight: 36, px: 2 }} />
            </Tabs>
            {tabValue === 0 && (
              <Box sx={{ p: 2 }}>
                {/* Form View */}
                <Paper sx={{ p: 2, mb: 2, backgroundColor: '#FFFFFF', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                  {renderFormFields()}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
                    <Button variant="contained" startIcon={<AddCircleIcon fontSize="small" />} onClick={addRow} size="small" sx={{ fontSize: '0.8rem', py: 0.5 }}>
                      Add Row
                    </Button>
                  </Box>
                </Paper>

                {/* Data Summary */}
                {rowsForActiveModule.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.primary', fontSize: '0.8rem' }}>
                      Data Summary
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', overflowX: 'auto', gap: 1.5, pb: 1 }}>
                      {rowsForActiveModule.map((row, idx) => {
                        const testConfig = TEST_MAPPING[activeModule] || { inputs: [] };
                        return (
                          <Paper
                            key={idx}
                            sx={{
                              width: 200,
                              minWidth: 200,
                              minHeight: 150, // Fixed height to match tallest box (e.g., Load Creation with 3 fields)
                              p: 1,
                              border: '1px solid',
                              borderColor: 'grey.200',
                              borderRadius: 2,
                              background: '#FFFFFF',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 0.5
                            }}
                          >
                            <Typography variant="caption" sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
                              Test Case #{idx + 1}
                            </Typography>
                            {testConfig.inputs.map((input) => (
                              row[input.name] && (
                                <Box
                                  key={input.name}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: 28, // Fixed height for all fields
                                    fontSize: '0.8rem',
                                    color: 'text.primary',
                                    bgcolor: '#F5F5F5',
                                    borderRadius: 1,
                                    px: 1,
                                    py: 0.5
                                  }}
                                >
                                  <Typography variant="body2" sx={{ fontSize: '0.8rem', flex: 1 }} noWrap>
                                    {input.label}: {row[input.name]}
                                  </Typography>
                                </Box>
                              )
                            ))}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 'auto' }}>
                              <IconButton
                                onClick={() => copyRow(idx)}
                                size="small"
                                title="Copy Row"
                                sx={{ p: 0.5, width: 24, height: 24 }}
                              >
                                <FileCopyIcon fontSize="small" color="primary" />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteRow(idx)}
                                size="small"
                                title="Delete Row"
                                sx={{ p: 0.5, width: 24, height: 24 }}
                              >
                                <DeleteIcon fontSize="small" color="error" />
                              </IconButton>
                            </Box>
                          </Paper>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* Table View */}
            {tabValue === 1 && (
              <Box sx={{ p: 2 }}>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'grey.200',
                    borderRadius: 2,
                    mb: 2,
                    background: '#FFFFFF'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                    <Button variant="contained" startIcon={<AddCircleIcon fontSize="small" />} onClick={addRow} size="small" sx={{ fontSize: '0.8rem', py: 0.5 }}>
                      Add Row
                    </Button>
                  </Box>
                  <Table size="small">
                  <TableHead>
              <TableRow>
                <TableCell sx={{ width: '50px', py: 1, fontSize: '0.7rem' }}>#</TableCell>
                {fields.map((f) => (
                  <TableCell 
                    key={f} 
                    sx={{ 
                      py: 1, 
                      fontSize: '0.7rem', 
                      fontWeight: 600,
                      minWidth: '150px'  // Increase the minimum width for each field column
                    }}
                  >
                    {f}
                  </TableCell>
                ))}
                <TableCell sx={{ width: '180px', py: 1, fontSize: '0.8rem' }}>Created At</TableCell>
                <TableCell sx={{ width: '120px', py: 1, fontSize: '0.8rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>

                    <TableBody>
                      {rowsForActiveModule.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={fields.length + 3} align="center" sx={{ py: 3, fontSize: '0.85rem' }}>
                            <Typography variant="body2" color="text.secondary">
                              No data available
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        rowsForActiveModule.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ backgroundColor: '#F5F5F5', py: 0.5, fontSize: '0.8rem' }}>{idx + 1}</TableCell>
                            {fields.map((f) => (
                              <TableCell key={f} sx={{ py: 0.5 }}>
                                <TextField
                                  size="small"
                                  fullWidth
                                  value={row[f] || ''}
                                  onChange={(e) => handleCellEdit(idx, f, e.target.value)}
                                  disabled={f === 'Result=>' || f === 'Expected Sales Order Number'}
                                  variant="outlined"
                                  sx={{ '& .MuiInputBase-root': { height: 32, fontSize: '0.8rem' } }}
                                />
                              </TableCell>
                            ))}
                            <TableCell sx={{ backgroundColor: '#F5F5F5', py: 0.5, fontSize: '0.8rem' }}>{row.createdAt}</TableCell>
                            <TableCell sx={{ backgroundColor: '#F5F5F5', py: 0.5 }}>
                              <IconButton onClick={() => copyRow(idx)} size="small" color="primary">
                                <FileCopyIcon fontSize="small" />
                              </IconButton>
                              <IconButton onClick={() => handleDeleteRow(idx)} size="small" color="error">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ textAlign: 'right', p: 1.5, pt: 0 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<SaveAltIcon fontSize="small" />}
                    disabled={Object.values(moduleData).every(rows => rows.length === 0)}
                    onClick={exportExcel}
                    size="small"
                    sx={{ fontSize: '0.8rem', py: 0.5 }}
                  >
                    Export to Excel
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </GlassCard>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ fontSize: '0.85rem' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, rowIndex: -1 })}
        PaperProps={{ elevation: 3, sx: { borderRadius: 2, background: '#FFFFFF', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.9rem' }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
            Are you sure you want to delete this row? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 1.5, pt: 0 }}>
          <Button variant="outlined" onClick={() => setDeleteDialog({ open: false, rowIndex: -1 })} size="small" sx={{ fontSize: '0.8rem', py: 0.5 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDeleteRow}
            startIcon={<DeleteIcon fontSize="small" />}
            size="small"
            sx={{ fontSize: '0.8rem', py: 0.5 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}

export default ModuleContent;