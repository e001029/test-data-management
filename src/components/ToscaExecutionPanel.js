// ToscaExecutionPanel.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  TextField,
  Button,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Divider,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StorageIcon from '@mui/icons-material/Storage';
import CategoryIcon from '@mui/icons-material/Category';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InfoIcon from '@mui/icons-material/Info';
import Select from '@mui/material/Select';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// -----------------------------------------------------------------------------
// COMMON STYLE OBJECT FOR INPUT FIELDS
// -----------------------------------------------------------------------------
const commonInputStyles = {
  fontSize: '0.7rem',
  height: 32,
  lineHeight: '32px',
  padding: '0 8px',
  width: '100%',
  minWidth: '200px',
};

// -----------------------------------------------------------------------------
// RENDER INPUT FIELDS FUNCTION
// -----------------------------------------------------------------------------
const renderInputFields = (test, testInputs, handleInputChange, executionState) => {
  if (!test.inputs) return null;
  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Divider sx={{ mb: 2 }} />
      <Typography
        variant="caption"
        gutterBottom
        color="text.secondary"
        sx={{ display: 'block', mb: 1.5 }}
      >
        Test Parameters
      </Typography>
      <Grid container spacing={2}>
        {test.inputs.map((input) => (
          <Grid item xs={12} sm={4} key={input.name}>
            {input.type === 'select' ? (
              <TextField
                select
                fullWidth
                variant="outlined"
                size="small"
                label={input.label}
                value={testInputs[test.id][input.name] || ''}
                onChange={(e) => handleInputChange(test.id, input.name, e.target.value)}
                disabled={executionState.loading}
                InputLabelProps={{ shrink: true, sx: { ...commonInputStyles } }}
                InputProps={{ sx: { ...commonInputStyles } }}
                SelectProps={{
                  displayEmpty: true,
                  sx: { ...commonInputStyles, paddingRight: '32px' },
                  renderValue: (value) =>
                    value === '' ? (
                      <span style={{ color: 'rgba(0, 0, 0, 0.6)', ...commonInputStyles }}>
                        {input.label}
                      </span>
                    ) : (
                      value
                    ),
                }}
              >
                <MenuItem value="">
                  <em>{input.label}</em>
                </MenuItem>
                {input.options.map((option) => (
                  <MenuItem key={option} value={option} sx={{ ...commonInputStyles }}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label={input.label}
                placeholder={input.placeholder}
                value={testInputs[test.id][input.name] || ''}
                onChange={(e) => handleInputChange(test.id, input.name, e.target.value)}
                required
                disabled={executionState.loading}
                InputLabelProps={{ shrink: true, sx: { ...commonInputStyles } }}
                InputProps={{ sx: { ...commonInputStyles, '& input': { padding: 0 } } }}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// -----------------------------------------------------------------------------
// THEME
// -----------------------------------------------------------------------------
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0078D4', light: '#5EA9FF', dark: '#005BA1' },
    secondary: { main: '#00C4B4', light: '#5DF2D6', dark: '#008C7A' },
    background: { default: '#F5F6F5', paper: '#FFFFFF' },
    text: { primary: '#333333', secondary: '#666666' },
    success: { main: '#28A745' },
    error: { main: '#DC3545' },
    warning: { main: '#FFC107' },
    info: { main: '#17A2B8' },
    grey: { 
      50: '#FAFAFA', 100: '#F5F5F5', 200: '#EEEEEE', 300: '#E0E0E0', 
      400: '#BDBDBD', 500: '#9E9E9E', 600: '#757575', 700: '#616161', 
      800: '#424242', 900: '#212121' 
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 11,
    h5: { fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.2 },
    body1: { fontSize: '0.75rem', lineHeight: 1.5 },
    body2: { fontSize: '0.65rem', lineHeight: 1.5 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { backgroundColor: '#F5F6F5' } } },
    MuiDrawer: { 
      styleOverrides: { 
        paper: { 
          background: '#FFFFFF', 
          borderRight: '1px solid #E0E0E0', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
        } 
      } 
    },
    MuiCard: { 
      styleOverrides: { 
        root: { 
          background: '#FFFFFF', 
          border: '1px solid #E0E0E0', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
          borderRadius: 8 
        } 
      } 
    },
    MuiButton: { 
      styleOverrides: { 
        root: { 
          background: 'linear-gradient(45deg, #0078D4 30%, #00C4B4 90%)', 
          '&:hover': { boxShadow: '0 4px 16px rgba(0, 120, 212, 0.3)' }, 
          transition: 'all 0.3s ease', 
          borderRadius: 6, 
          textTransform: 'none',
          fontSize: '0.7rem',
          color: '#FFFFFF',
        },
        outlined: {
          color: '#FFFFFF',
          borderColor: '#FFFFFF',
        },
        contained: {
          color: '#FFFFFF',
        },
      } 
    },
    MuiTextField: { 
      styleOverrides: { 
        root: { 
          '& .MuiOutlinedInput-root': { 
            background: '#FFFFFF', 
            '&:hover fieldset': { borderColor: '#5EA9FF' }, 
            '&.Mui-focused fieldset': { borderColor: '#0078D4' },
            '& .MuiInputBase-input': { fontSize: '0.7rem', padding: '6px 8px' },
          },
          '& .MuiInputLabel-root': { fontSize: '0.7rem' },
        } 
      } 
    },
    MuiTableCell: { 
      styleOverrides: { 
        head: { backgroundColor: '#F5F5F5', color: '#333333', fontWeight: 600, fontSize: '0.7rem' },
        body: { color: '#333333', borderBottom: '1px solid #E0E0E0', fontSize: '0.7rem' },
      } 
    },
    MuiTableRow: { 
      styleOverrides: { '&:hover': { backgroundColor: '#F5F5F5' } } 
    },
    MuiTabs: { 
      styleOverrides: { root: { backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0' } } 
    },
    MuiTab: { 
      styleOverrides: { root: { color: '#666666', '&.Mui-selected': { color: '#0078D4' }, fontSize: '0.7rem' } } 
    },
    MuiSelect: {
      styleOverrides: { root: { '& .MuiSelect-select': { fontSize: '0.7rem', padding: '6px 8px' } } },
    },
    MuiMenuItem: {
      styleOverrides: { root: { fontSize: '0.7rem' } },
    },
  },
});

// -----------------------------------------------------------------------------
// STYLED COMPONENTS
// -----------------------------------------------------------------------------
const GlassCard = styled(Paper)(({ theme }) => ({
  background: '#FFFFFF',
  border: '1px solid #E0E0E0',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  borderRadius: 8,
  transition: 'box-shadow 0.3s ease',
  '&:hover': { boxShadow: '0 6px 20px rgba(0,120,212,0.2)' },
}));

const TestCardIcon = styled('div')(({ theme, bgColor }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: bgColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#FFFFFF',
  fontSize: '1rem',
  marginRight: theme.spacing(1),
}));

// -----------------------------------------------------------------------------
// TOSCA CONFIGURATION
// -----------------------------------------------------------------------------
const TOSCA_CONFIG = {
  TOKEN_URL: 'https://bnatossvr04.nucorsteel.local/tua/connect/token',
  EXECUTION_URL: 'https://bnatossvr04.nucorsteel.local/automationobjectservice/api/Execution/enqueue',
  STATUS_URL: 'https://bnatossvr04.nucorsteel.local/automationobjectservice/api/Execution',
  CREDENTIALS: {
    grant_type: 'client_credentials',
    client_id: 'XaS6nmGk70W35q6quyqTBw',
    client_secret: 'C5_L1YSlJEuf9M_GnSXgUA-tHNs9z3HU6Ift9havYvoQ',
  },
};

// -----------------------------------------------------------------------------
// FETCH NETWORK EXCEL FUNCTION
// -----------------------------------------------------------------------------
async function fetchNetworkExcel(networkPath, username, password, executionId) {
  const SERVER_URL = 'http://localhost:3001'; // Adjust to your actual server URL
  const response = await fetch(`${SERVER_URL}/api/network-excel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: networkPath, username, password, executionId }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to access network path: ${response.statusText}`);
  }
  return await response.json();
}

// -----------------------------------------------------------------------------
// TOSCA EXECUTION PANEL COMPONENT
// -----------------------------------------------------------------------------
function ToscaExecutionPanel({ environment, showSnackbar }) {
  const [tabValue, setTabValue] = useState(0);
  const [expandedTest, setExpandedTest] = useState(null);
  const [executionState, setExecutionState] = useState({
    step: 0,
    token: null,
    executionId: null,
    status: null,
    error: null,
    loading: false,
    progress: 0,
    result: null,
    testToRun: null,
  });
  const [testInputs, setTestInputs] = useState({
    Order_Creation: { eventName: '' },
    Caster_Production: { eventName: '', PgId: '' },
    Quality_Validation: { eventName: '', heatNumber: '' },
    Load_Creation: { eventName: '', orderNumber: '', customerNumber: '' },
    Shipping_Process: { eventName: '', orderNumber: '', customerNumber: '' },
  });
  const networkPathOptions = [
    "\\\\BNATOSFS01\\Tricentis\\Tosca_CommonRepositories\\FlatMill\\SheetMill\\SheetMill_SalesOrderCreation\\Attributes-Flat_SHEET_Mill\\EBS & Configurator Attributes\\SalesOrder1",
    "\\\\BNATOSFS01\\Tricentis\\Tosca_CommonRepositories\\FlatMill\\SheetMill\\SheetMill_SalesOrderCreation\\Attributes-Flat_SHEET_Mill\\EBS & Configurator Attributes\\SalesOrder2",
    "Custom",
  ];
  const [networkCredentials, setNetworkCredentials] = useState({
    path: networkPathOptions[0],
    username: '',
    password: '',
    isConfigured: false,
    customPath: '',
  });
  const [resultData, setResultData] = useState(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [networkPathDialog, setNetworkPathDialog] = useState(false);

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1 && executionState.executionId && networkCredentials.isConfigured && !resultData) {
      fetchResultsData();
    }
  };

  const handleInputChange = (testId, field, value) => {
    setTestInputs((prev) => ({ ...prev, [testId]: { ...prev[testId], [field]: value } }));
  };

  const handleCredentialChange = (field, value) => {
    setNetworkCredentials((prev) => ({ ...prev, [field]: value }));
  };

  const normalizePath = (path) => {
    path = path.trim();
    if (path.startsWith('\\\\')) {
      return '\\\\' + path.slice(2).replace(/\\+/g, '\\');
    } else if (path.startsWith('\\')) {
      return '\\\\' + path.slice(1).replace(/\\+/g, '\\');
    } else {
      return '\\\\' + path.replace(/\\+/g, '\\');
    }
  };

  const saveNetworkCredentials = () => {
    const effectivePath = networkCredentials.path === "Custom" ? networkCredentials.customPath : networkCredentials.path;
    if (!effectivePath) {
      showSnackbar('Network path is required', 'warning');
      return;
    }
    setNetworkCredentials((prev) => ({
      ...prev,
      path: networkCredentials.path,
      customPath: networkCredentials.path === "Custom" ? prev.customPath : '',
      isConfigured: true,
    }));
    setNetworkPathDialog(false);
    showSnackbar('Network path configured successfully', 'success');
    if (executionState.executionId && tabValue === 1) fetchResultsData();
  };

  const fetchResultsData = async () => {
    if (!networkCredentials.isConfigured) {
      setNetworkPathDialog(true);
      return;
    }
    if (!executionState.executionId) {
      showSnackbar('No execution ID available', 'warning');
      return;
    }
    setIsLoadingResults(true);
    try {
      const effectivePath =
        networkCredentials.path === "Custom"
          ? normalizePath(networkCredentials.customPath)
          : normalizePath(networkCredentials.path);
      const excelData = await fetchNetworkExcel(
        effectivePath,
        networkCredentials.username,
        networkCredentials.password,
        executionState.executionId
      );
      setResultData(excelData);
      showSnackbar(`Successfully loaded ${excelData.rows.length} result records`, 'success');
    } catch (error) {
      showSnackbar(`Error loading results: ${error.message}`, 'error');
    } finally {
      setIsLoadingResults(false);
    }
  };

  const TESTS = [
    {
      id: 'Order_Creation',
      name: 'Order Creation',
      description: 'Tests the creation and validation of orders in the system',
      icon: <StorageIcon />,
      color: '#3f51b5',
      inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Order Creation'] }],
    },
    {
      id: 'Caster_Production',
      name: 'Caster and Production Process',
      description: 'Tests the caster operations and production process validation',
      icon: <CategoryIcon />,
      color: '#f44336',
      inputs: [
        { name: 'eventName', label: 'Event Name', type: 'select', options: ['Skin Pass', 'Annealing', 'Galvenzing', 'Hot Rolled', 'Cold Rolled'] },
        { name: 'PgId', label: 'Program ID', placeholder: 'Enter program ID', type: 'text' },
      ],
    },
    {
      id: 'Quality_Validation',
      name: 'Quality Validation Process',
      description: 'Tests quality assurance and validation procedures',
      icon: <CheckCircleIcon />,
      color: '#4caf50',
      inputs: [
        { name: 'eventName', label: 'Event Name', type: 'select', options: ['Quality Validation'] },
        { name: 'heatNumber', label: 'Heat Number', placeholder: 'Enter heat number', type: 'text' },
      ],
    },
    {
      id: 'Load_Creation',
      name: 'Load Creation Process',
      description: 'Tests the creation and validation of load processes',
      icon: <LocalShippingIcon />,
      color: '#ff9800',
      inputs: [
        { name: 'eventName', label: 'Event Name', type: 'select', options: ['Load Creation'] },
        { name: 'orderNumber', label: 'Order Number', placeholder: 'Enter order number', type: 'text' },
        { name: 'customerNumber', label: 'Customer Number', placeholder: 'Enter customer number', type: 'text' },
      ],
    },
    {
      id: 'Shipping_Process',
      name: 'Shipping Process',
      description: 'Tests the complete shipping workflow including documentation',
      icon: <LocalShippingIcon />,
      color: '#9c27b0',
      inputs: [
        { name: 'eventName', label: 'Event Name', type: 'select', options: ['Shipping Process'] },
        { name: 'orderNumber', label: 'Order Number', placeholder: 'Enter order number', type: 'text' },
        { name: 'customerNumber', label: 'Customer Number', placeholder: 'Enter customer number', type: 'text' },
      ],
    },
  ];

  const validateInputs = (testId) => {
    const test = TESTS.find((t) => t.id === testId);
    return test.inputs.every((input) => testInputs[testId] && testInputs[testId][input.name]?.trim());
  };

  const startExecution = async (testId) => {
    if (!validateInputs(testId)) {
      showSnackbar('Please fill in all required fields for this test', 'warning');
      return;
    }
    setExecutionState({
      step: 1,
      token: null,
      executionId: null,
      status: null,
      error: null,
      loading: true,
      progress: 10,
      result: null,
      testToRun: testId,
    });
    try {
      const tokenFormData = new URLSearchParams();
      tokenFormData.append('grant_type', TOSCA_CONFIG.CREDENTIALS.grant_type);
      tokenFormData.append('client_id', TOSCA_CONFIG.CREDENTIALS.client_id);
      tokenFormData.append('client_secret', TOSCA_CONFIG.CREDENTIALS.client_secret);
      const tokenResponse = await fetch(TOSCA_CONFIG.TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: tokenFormData,
      });
      if (!tokenResponse.ok) throw new Error(`Token request failed: ${tokenResponse.statusText}`);
      const tokenData = await tokenResponse.json();
      const token = tokenData.access_token;
      setExecutionState((prev) => ({ ...prev, step: 2, token, progress: 30 }));

      const currentInputs = testInputs[testId];
      const parameters = {
        ...(environment && { Environment: environment }),
        ...Object.fromEntries(
          Object.entries(currentInputs)
            .filter(([k]) => k !== 'eventName')
            .map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v])
        ),
      };
      const executionBody = {
        projectName: 'NBTToscaProject',
        executionEnvironment: 'Dex',
        events: [{ eventId: currentInputs.eventName, parameters }],
        importResult: true,
        creator: 'Lakshmi',
      };
      const executionResponse = await fetch(TOSCA_CONFIG.EXECUTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tricentis': 'OK',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(executionBody),
      });
      if (!executionResponse.ok) throw new Error(`Execution request failed: ${executionResponse.statusText}`);
      const executionData = await executionResponse.json();
      const executionId = executionData.ExecutionId;
      setExecutionState((prev) => ({ ...prev, step: 3, executionId, progress: 50, status: 'Running' }));
      const startTime = Date.now();
      await checkExecutionStatus(token, executionId, startTime);
    } catch (error) {
      setExecutionState((prev) => ({ ...prev, error: error.message, loading: false }));
      showSnackbar(`Error executing test: ${error.message}`, 'error');
    }
  };

  const checkExecutionStatus = async (token, executionId, startTime) => {
    const maxWaitTime = 35 * 60 * 1000;
    if (Date.now() - startTime > maxWaitTime) {
      setExecutionState((prev) => ({
        ...prev,
        loading: false,
        error: 'Test execution timed out',
        status: 'Timeout',
        result: 'Failed',
      }));
      showSnackbar('Test execution timed out after 35 minutes', 'error');
      return;
    }
    try {
      const statusResponse = await fetch(`${TOSCA_CONFIG.STATUS_URL}/${executionId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tricentis': 'OK',
        },
      });
      if (!statusResponse.ok) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return await checkExecutionStatus(token, executionId, startTime);
      }
      const statusData = await statusResponse.json();
      if (['Completed', 'Failed', 'Error'].includes(statusData.status)) {
        setExecutionState((prev) => ({
          ...prev,
          status: statusData.status,
          progress: statusData.status === 'Completed' ? 100 : 90,
          result: statusData.status === 'Completed' ? (statusData.result || 'Passed') : 'Failed',
          loading: false,
          error:
            statusData.status === 'Error'
              ? 'Execution encountered an error'
              : statusData.status === 'Failed'
              ? 'Execution failed'
              : null,
        }));
        showSnackbar(
          statusData.status === 'Completed'
            ? `Test execution completed: ${statusData.result || 'Passed'}`
            : `Test execution ${statusData.status.toLowerCase()}`,
          statusData.status === 'Completed' ? 'success' : 'error'
        );
      } else {
        setExecutionState((prev) => ({
          ...prev,
          status: statusData.status,
          progress: Math.min(90, prev.progress + 5),
        }));
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await checkExecutionStatus(token, executionId, startTime);
      }
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await checkExecutionStatus(token, executionId, startTime);
    }
  };

  const toggleAccordion = (testId) => {
    setExpandedTest((prev) => (prev === testId ? null : testId));
  };

  const getStatusIcon = (testId) => {
    if (executionState.testToRun !== testId) return <HourglassEmptyIcon color="disabled" fontSize="small" />;
    if (executionState.loading) return <CircularProgress size={14} />;
    if (executionState.error) return <ErrorIcon color="error" fontSize="small" />;
    if (executionState.result === 'Passed') return <CheckCircleIcon color="success" fontSize="small" />;
    if (executionState.result === 'Failed') return <ErrorIcon color="error" fontSize="small" />;
    return <HourglassEmptyIcon color="disabled" fontSize="small" />;
  };

  // ---------------------------------------------------------------------------
  // RENDER EXCEL RESULTS SECTION
  // ---------------------------------------------------------------------------
  const renderResultsSection = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontSize: '0.85rem' }}>
        Test Execution Results
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
          {resultData
            ? `Found ${resultData.rows.length} records in the ${resultData.sheetName} sheet with ${resultData.headers.length} fields`
            : 'No results loaded'}
        </Typography>
        <Box>
          {!networkCredentials.isConfigured ? (
            <Button variant="outlined" color="primary" startIcon={<SettingsIcon />} onClick={() => setNetworkPathDialog(true)} size="small">
              Configure Network Path
            </Button>
          ) : (
            <Box>
              <Button
                variant="outlined"
                color="primary"
                startIcon={isLoadingResults ? <CircularProgress size={14} /> : <RefreshIcon />}
                onClick={fetchResultsData}
                disabled={isLoadingResults}
                size="small"
                sx={{ mr: 1 }}
              >
                {isLoadingResults ? 'Loading...' : 'Refresh Results'}
              </Button>
              <Button variant="outlined" color="secondary" startIcon={<SettingsIcon />} onClick={() => setNetworkPathDialog(true)} size="small">
                Edit Path
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      {resultData ? (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: alpha(theme.palette.primary.light, 0.1) }}>
          <TableContainer component={Paper} variant="outlined" sx={{ mt: 2, maxHeight: 500, overflow: 'auto' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {resultData.headers.map((header) => (
                    <TableCell key={header} sx={{ fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {resultData.rows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor:
                        row.Status?.toLowerCase() === 'failed'
                          ? alpha('#ffebee', 0.5)
                          : row.Status?.toLowerCase() === 'passed'
                          ? alpha('#e8f5e9', 0.5)
                          : 'inherit',
                    }}
                  >
                    {resultData.headers.map((header) => (
                      <TableCell key={`${index}-${header}`}>
                        {header === 'Status' ? (
                          <Chip
                            label={row[header] || 'N/A'}
                            size="small"
                            color={
                              row[header]?.toLowerCase() === 'passed'
                                ? 'success'
                                : row[header]?.toLowerCase() === 'failed'
                                ? 'error'
                                : 'default'
                            }
                          />
                        ) : (
                          row[header] || ''
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center', borderStyle: 'dashed', borderColor: 'grey.400' }}>
          <Typography color="text.secondary">
            {networkCredentials.isConfigured
              ? isLoadingResults
                ? 'Loading result data...'
                : 'Click "Refresh Results" to load test results'
              : 'Configure network path to view test results'}
          </Typography>
        </Paper>
      )}
    </Box>
  );

  // ---------------------------------------------------------------------------
  // RENDERING THE COMPONENT
  // ---------------------------------------------------------------------------
  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <GlassCard sx={{ mb: 3, mr: 0, mt: 3 }}>
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box
            sx={{
              p: 3,
              background: 'linear-gradient(90deg, #E6F0FA 0%, #DCEBFF 100%)',
              color: '#333333',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontSize: '1.2rem' }}>
                  Test Execution
                </Typography>
              </Box>
              <Chip
                label={executionState.loading ? 'Running Test...' : 'Ready'}
                color={executionState.loading ? 'secondary' : 'default'}
                size="small"
                sx={{
                  borderRadius: 4,
                  backgroundColor: executionState.loading ? '#E6F0FA' : '#FFFFFF',
                  color: '#333333',
                }}
              />
            </Box>
          </Box>
          {/* Tabs */}
          <Box sx={{ px: 3, py: 2.5 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="test execution tabs" sx={{ mb: 3 }}>
              <Tab label="Test Cases" />
              <Tab label="Execution Status" disabled={!executionState.executionId} />
              <Tab label="Help" />
            </Tabs>
            {tabValue === 0 && (
              <>
                <Stepper activeStep={executionState.step} sx={{ mb: 4, '& .MuiStepConnector-line': { minHeight: 0 } }}>
                  <Step>
                    <StepLabel>Authentication</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Launch Test</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Track Progress</StepLabel>
                  </Step>
                </Stepper>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '0.95rem' }}>
                  Order Creation Workflow Till Shipping And Invoicing
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {TESTS.map((test) => (
                    <Accordion key={test.id} expanded={expandedTest === test.id} onChange={() => toggleAccordion(test.id)} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TestCardIcon bgColor={test.color}>{test.icon}</TestCardIcon>
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {test.name}
                            </Typography>
                          </Box>
                          {getStatusIcon(test.id)}
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 1 }}>
                          {test.description}
                        </Typography>
                        {renderInputFields(test, testInputs, handleInputChange, executionState)}
                        <Button
                          fullWidth
                          variant="contained"
                          size="small"
                          color={
                            executionState.testToRun === test.id && executionState.result === 'Passed'
                              ? 'success'
                              : executionState.testToRun === test.id && executionState.error
                              ? 'error'
                              : 'primary'
                          }
                          startIcon={
                            executionState.loading && executionState.testToRun === test.id ? (
                              <CircularProgress size={12} color="inherit" />
                            ) : (
                              <PlayArrowIcon fontSize="small" />
                            )
                          }
                          onClick={() => startExecution(test.id)}
                          disabled={executionState.loading}
                          sx={{ mt: 1 }}
                        >
                          {executionState.testToRun === test.id && executionState.result === 'Passed'
                            ? 'Test Passed'
                            : executionState.testToRun === test.id && executionState.error
                            ? 'Test Failed'
                            : executionState.loading && executionState.testToRun === test.id
                            ? 'Running...'
                            : 'Run Test'}
                        </Button>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </>
            )}
            {tabValue === 1 && executionState.executionId && (
              <Box>
                <Paper sx={{ p: 3, borderRadius: 2, mb: 4, border: '1px solid', borderColor: 'primary.light' }}>
                  <Typography variant="h5" gutterBottom sx={{ fontSize: '0.95rem' }}>
                    Execution Summary
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Execution ID
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {executionState.executionId}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Status
                      </Typography>
                      <Chip
                        label={executionState.status || 'N/A'}
                        size="small"
                        color={
                          executionState.status === 'Completed'
                            ? 'success'
                            : executionState.status === 'Running'
                            ? 'primary'
                            : ['Failed', 'Error', 'Timeout'].includes(executionState.status)
                            ? 'error'
                            : 'default'
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Result
                      </Typography>
                      <Chip
                        label={executionState.result || 'Pending'}
                        size="small"
                        color={
                          executionState.result === 'Passed'
                            ? 'success'
                            : executionState.result === 'Failed'
                            ? 'error'
                            : 'default'
                        }
                      />
                    </Grid>
                  </Grid>
                </Paper>
                {executionState.testToRun && (
                  <Paper sx={{ p: 3, borderRadius: 2, mb: 4, border: '1px solid', borderColor: 'grey.300' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '0.85rem' }}>
                      Test Parameters
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Parameter</TableCell>
                            <TableCell>Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {environment && (
                            <TableRow>
                              <TableCell>Environment</TableCell>
                              <TableCell>{environment}</TableCell>
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell>Event Name</TableCell>
                            <TableCell>{testInputs[executionState.testToRun].eventName}</TableCell>
                          </TableRow>
                          {Object.entries(testInputs[executionState.testToRun])
                            .filter(([key]) => key !== 'eventName')
                            .map(([key, value]) =>
                              value.trim() !== '' && (
                                <TableRow key={key}>
                                  <TableCell>{key.charAt(0).toUpperCase() + key.slice(1)}</TableCell>
                                  <TableCell>{value}</TableCell>
                                </TableRow>
                              )
                            )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                )}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '0.85rem' }}>
                    Progress Timeline
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'grey.300',
                      borderRadius: 2,
                      backgroundColor: '#F5F5F5',
                    }}
                  >
                    <LinearProgress variant="determinate" value={executionState.progress} sx={{ height: 8, borderRadius: 5, mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Started
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {executionState.progress}% Complete
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                {renderResultsSection()}
              </Box>
            )}
            {tabValue === 2 && (
              <Box>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    mb: 4,
                    backgroundColor: '#E6F0FA',
                    color: '#333333',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoIcon sx={{ mr: 1 }} />
                    <Typography variant="h5" fontWeight={600} sx={{ fontSize: '0.95rem' }}>
                      How to Use Test Execution
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    This panel allows you to execute automated tests against your data. Follow these steps:
                  </Typography>
                  <ol style={{ marginLeft: '1.5rem' }}>
                    <li>Select a product type and environment from the global settings</li>
                    <li>Enter your test data in the appropriate modules</li>
                    <li>Choose one of the available test cases</li>
                    <li>Fill in any required test parameters including the Event Name</li>
                    <li>Click the "Run Test" button to start execution</li>
                    <li>Monitor the progress and check results</li>
                    <li>Configure network path to view Excel results after test execution</li>
                  </ol>
                </Paper>
              </Box>
            )}
          </Box>
        </CardContent>
        {/* Network Path Configuration Dialog */}
        <Dialog open={networkPathDialog} onClose={() => setNetworkPathDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontSize: '0.95rem' }}>Configure Network Path</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2, fontSize: '0.75rem' }}>
              Select a network path and enter credentials to access Excel result files.
            </DialogContentText>
            <FormControl fullWidth margin="dense" variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Network Path</InputLabel>
              <Select
                value={networkCredentials.path}
                onChange={(e) => handleCredentialChange('path', e.target.value)}
                label="Network Path"
              >
                {networkPathOptions.map((path) => (
                  <MenuItem key={path} value={path}>
                    {path}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {networkCredentials.path === "Custom" && (
              <TextField
                label="Custom Network Path"
                fullWidth
                margin="dense"
                variant="outlined"
                value={networkCredentials.customPath}
                onChange={(e) => handleCredentialChange('customPath', e.target.value)}
                sx={{ mb: 2 }}
                placeholder="Enter custom network path"
              />
            )}
            <TextField
              label="Username"
              fullWidth
              margin="dense"
              variant="outlined"
              value={networkCredentials.username}
              onChange={(e) => handleCredentialChange('username', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              fullWidth
              margin="dense"
              variant="outlined"
              type="password"
              value={networkCredentials.password}
              onChange={(e) => handleCredentialChange('password', e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNetworkPathDialog(false)} size="small">
              Cancel
            </Button>
            <Button variant="contained" onClick={saveNetworkCredentials} size="small">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </GlassCard>
    </motion.div>
  );
}

export default ToscaExecutionPanel;
