// src/pages/TestExecutionListPage.jsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { ListItemText } from '@mui/material';
// Import your Nucor logo
import logo from '../assets/getsitelogo.png';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

import {
  Chart as ChartJS,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);
import { Chart } from 'react-chartjs-2';

import StorageIcon from '@mui/icons-material/Storage';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BuildIcon from '@mui/icons-material/Build';
import TimelineIcon from '@mui/icons-material/Timeline';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  ChartTooltipJS,
  Legend,
  PieController,
  BarController
);

// Placeholder for TOSCA_CONFIG
const TOSCA_CONFIG = {
  TOKEN_URL: 'https://bnatossvr04.nucorsteel.local/tua/connect/token',
  EXECUTION_URL: 'https://bnatossvr04.nucorsteel.local/automationobjectservice/api/Execution/enqueue',
  STATUS_URL: 'https://bnatossvr04.nucorsteel.local/automationobjectservice/api/Execution',
};

// -------------------------
// Error Boundary
// -------------------------
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Something went wrong!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

// -------------------------
// Example styled components
// -------------------------
const NeumorphicCard = styled(Card)(() => ({
  background: 'linear-gradient(145deg, #f0f0f0, #e0e0e0)',
  borderRadius: 8,
  boxShadow: '3px 3px 10px rgba(0,0,0,0.1), -3px -3px 10px rgba(255,255,255,0.8)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '5px 5px 15px rgba(0,0,0,0.15), -5px -5px 15px rgba(255,255,255,0.9)',
    transform: 'translateY(-1px)',
  },
}));

const GradientButton = styled(Button)(() => ({
  background: 'linear-gradient(45deg, #0078D4 30%, #00C4B4 90%)',
  color: '#FFFFFF',
  borderRadius: 6,
  padding: '6px 12px',
  textTransform: 'none',
  fontSize: '0.7rem',
  '&:hover': {
    background: 'linear-gradient(45deg, #005BA1 30%, #008C7A 90%)',
    boxShadow: '0 3px 8px rgba(0,120,212,0.3)',
  },
}));


// -------------------------
// Common styles for input fields
// You can update minWidth here (e.g., to 250px) for increased field size
// -------------------------
const commonInputStyles = {
  fontSize: '0.7rem',
  height: 32,
  lineHeight: '32px',
  padding: '0 8px',
  width: '100%',
  minWidth: '250px', // Updated for increased width (adjust as needed)
};

// -------------------------
// Custom renderInputFields function for uniform select and text field sizing
// -------------------------
const renderInputFieldsCustom = (test, testInputs, handleInputChange, executionState) => {
  if (!test.inputs) return null;
  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Divider sx={{ mb: 2 }} />
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
                InputLabelProps={{
                  shrink: true,
                  sx: { ...commonInputStyles },
                }}
                InputProps={{
                  sx: { ...commonInputStyles },
                }}
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
                InputLabelProps={{
                  shrink: true,
                  sx: { ...commonInputStyles },
                }}
                InputProps={{
                  sx: { ...commonInputStyles, '& input': { padding: 0 } },
                }}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// -------------------------
// Main Component: TestExecutionListPage
// -------------------------
function TestExecutionListPage({ onBack }) {
  // Particle initialization
  const particlesInit = async (engine) => {
    try {
      await loadSlim(engine);
    } catch (error) {
      console.error('Failed to initialize particles:', error);
    }
  };

  const particleOptions = {
    particles: {
      number: { value: 100, density: { enable: true, value_area: 800 } },
      color: { value: '#0078D4' },
      shape: { type: 'circle' },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      move: { enable: true, speed: 2, direction: 'none', random: true },
      links: { enable: true, distance: 150, color: '#00C4B4', opacity: 0.4 },
    },
    interactivity: {
      events: {
        onhover: { enable: true, mode: 'repulse' },
        onclick: { enable: true, mode: 'push' },
      },
    },
  };

  // -------------------------
  // State declarations
  // -------------------------
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
  const [testInputs, setTestInputs] = useState({});
  const [expanded, setExpanded] = useState({}); // Expanded business processes
  const [expandedTest, setExpandedTest] = useState({}); // Expanded test cases
  const [executionHistory, setExecutionHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus] = useState('All');

  // Ref to hold polling interval ID
  const pollingIntervalRef = useRef(null);

  // -------------------------
  // Define TEST_GROUPS_ORIGINAL with all test cases
  // -------------------------
  const TEST_GROUPS_ORIGINAL = [
    {
      id: 'L2C',
      name: 'L2C',
      tests: [
        {
          id: 'Internal_Requisition_Standard',
          name: '1.1 Internal Requisition/ Internal Sales Order - Standard',
          description: 'Tests internal requisition and sales order creation',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Order Creation'] }]
        },
        {
          id: 'Drop_Ship_External',
          name: '1.3 Drop Ship to External Customers',
          description: 'Tests drop shipping to external customers',
          icon: <LocalShippingIcon />,
          color: '#4caf50',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Drop Ship External'] },
            { name: 'customerNumber', label: 'Customer Number', placeholder: 'Enter customer number', type: 'text' }
          ]
        },
        {
          id: 'Direct_Order_Entry_Truck_Express',
          name: '1.10 Direct Order Entry - Truck - Express Pickup, Prepay and Add',
          description: 'Tests direct order entry with truck express pickup',
          icon: <LocalShippingIcon />,
          color: '#ff9800',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Direct Order Entry Truck Express'] },
            { name: 'orderNumber', label: 'Order Number', placeholder: 'Enter order number', type: 'text' }
          ]
        },
        {
          id: 'Direct_Order_Entry_Adhoc',
          name: '1.12 Direct Order Entry Adhoc',
          description: 'Tests adhoc direct order entry',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Direct Order Entry Adhoc'] }]
        },
        {
          id: 'Export_Order_Truck_CPU',
          name: '1.28 Export Order Direct Order Entry Truck CPU - Currency',
          description: 'Tests export order with truck CPU and currency',
          icon: <LocalShippingIcon />,
          color: '#9c27b0',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Export Order Truck CPU'] },
            { name: 'currency', label: 'Currency', placeholder: 'Enter currency', type: 'text' }
          ]
        },
        {
          id: 'Direct_Order_Rail_Express',
          name: '1.29 Direct Order Entry Rail Express Picking Prepay and Add',
          description: 'Tests direct order entry with rail express picking',
          icon: <LocalShippingIcon />,
          color: '#ff9800',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Direct Order Rail Express'] },
            { name: 'orderNumber', label: 'Order Number', placeholder: 'Enter order number', type: 'text' }
          ]
        },
        {
          id: 'Returns_Material_Mill',
          name: '1.41 Returns - Return Material to Mill',
          description: 'Tests return of material to mill',
          icon: <LocalShippingIcon />,
          color: '#4caf50',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Returns Material Mill'] },
            { name: 'materialId', label: 'Material ID', placeholder: 'Enter material ID', type: 'text' }
          ]
        },
        {
          id: 'Direct_Order_Truck_Combined',
          name: '1.29 Direct Order Entry - Truck - Combined Loads with Multi-Stop',
          description: 'Tests direct order entry with combined loads and multi-stop',
          icon: <LocalShippingIcon />,
          color: '#ff9800',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Direct Order Truck Combined'] },
            { name: 'orderNumber', label: 'Order Number', placeholder: 'Enter order number', type: 'text' }
          ]
        },
        {
          id: 'Work_Request_Order',
          name: '16.1 Work Request to Work Order',
          description: 'Tests conversion of work request to work order',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Work Request Order'] },
            { name: 'requestId', label: 'Request ID', placeholder: 'Enter request ID', type: 'text' }
          ]
        },
      ],
    },
    {
      id: 'EAM',
      name: 'EAM',
      tests: [
        {
          id: 'Project_Work_Order_PMM',
          name: '16.3 Project Work Order (PMM)',
          description: 'Tests project work order creation in PMM',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Project Work Order PMM'] },
            { name: 'projectId', label: 'Project ID', placeholder: 'Enter project ID', type: 'text' }
          ]
        },
        {
          id: 'Non_Serialized_Repair',
          name: '16.5 Non-Serialized Repair',
          description: 'Tests non-serialized repair process',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Non Serialized Repair'] },
            { name: 'assetId', label: 'Asset ID', placeholder: 'Enter asset ID', type: 'text' }
          ]
        },
        {
          id: 'Close_Work_Order',
          name: '16.7 Close Work Order',
          description: 'Tests closing of work orders',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Close Work Order'] },
            { name: 'workOrderId', label: 'Work Order ID', placeholder: 'Enter work order ID', type: 'text' }
          ]
        },
        {
          id: 'Generate_MRO_Reports',
          name: 'Generate MRO Inventory Reports',
          description: 'Tests generation of MRO inventory reports',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Generate MRO Reports'] }]
        },
        {
          id: 'Inventory_Misc_Transaction',
          name: '9.3 Inventory Miscellaneous Transaction',
          description: 'Tests miscellaneous inventory transactions',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Inventory Misc Transaction'] },
            { name: 'transactionId', label: 'Transaction ID', placeholder: 'Enter transaction ID', type: 'text' }
          ]
        },
      ],
    },
    {
      id: 'F2M_MAINT',
      name: 'F2M [MAINT]',
      tests: [
        {
          id: 'CEA_PMM_Projects',
          name: '11.3 CEA or PMM Projects',
          description: 'Tests CEA or PMM project processes',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['CEA PMM Projects'] },
            { name: 'projectId', label: 'Project ID', placeholder: 'Enter project ID', type: 'text' }
          ]
        },
        {
          id: 'Accounts_Payable_Daily',
          name: '15.11 Accounts Payable Daily (Non PO invoicing)',
          description: 'Tests daily accounts payable without PO',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Accounts Payable Daily'] },
            { name: 'invoiceId', label: 'Invoice ID', placeholder: 'Enter invoice ID', type: 'text' }
          ]
        },
        {
          id: 'Account_Payables_PO_Match',
          name: '15.11 Account Payables/PO Invoice Match',
          description: 'Tests matching of accounts payables with PO invoices',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Account Payables PO Match'] },
            { name: 'poNumber', label: 'PO Number', placeholder: 'Enter PO number', type: 'text' }
          ]
        },
        {
          id: 'Create_Accounting_AR',
          name: '3885 Create Accounting for AR',
          description: 'Tests creation of accounting entries for AR',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Create Accounting AR'] }]
        },
        {
          id: 'AR_Invoice_Print',
          name: 'Create AR Invoice and Print Report (standard)',
          description: 'Tests AR invoice creation and printing',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['AR Invoice Print'] }]
        },
        {
          id: 'IR_ISO_AR_Invoice',
          name: 'IR/ISO - AR Invoice and Print Report',
          description: 'Tests IR/ISO AR invoice and print report',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['IR ISO AR Invoice'] }]
        },
      ],
    },
    {
      id: 'S2P_PURCH_D2S_LPN',
      name: 'S2P',
      tests: [
        {
          id: 'Expense_Purchase_Check',
          name: '8.1 Expense Purchase Check',
          description: 'Tests expense purchase check process',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Expense Purchase Check'] },
            { name: 'expenseId', label: 'Expense ID', placeholder: 'Enter expense ID', type: 'text' }
          ]
        },
        {
          id: 'Expense_Purchase_Direct_PO',
          name: '8.3 Expense Purchase Direct PO creation',
          description: 'Tests direct PO creation for expense purchase',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Expense Purchase Direct PO'] },
            { name: 'poNumber', label: 'PO Number', placeholder: 'Enter PO number', type: 'text' }
          ]
        },
        {
          id: 'Tax_on_Purchasing',
          name: '9.2 Tax on Purchasing',
          description: 'Tests tax calculation on purchasing',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Tax on Purchasing'] }]
        },
        {
          id: 'LPN_Inventory_Creation',
          name: 'LPN and Inventory Creation',
          description: 'Tests LPN and inventory creation',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['LPN Inventory Creation'] },
            { name: 'lpnId', label: 'LPN ID', placeholder: 'Enter LPN ID', type: 'text' }
          ]
        },
        {
          id: 'Planning_Scheduling',
          name: '3.5 Planning and Scheduling',
          description: 'Tests planning and scheduling processes',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Planning Scheduling'] }]
        },
        {
          id: 'GMD_Material_Test_Report',
          name: 'GMD Material Test Report-Multiple Lots',
          description: 'Tests GMD material test report for multiple lots',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['GMD Material Test Report'] },
            { name: 'lotNumber', label: 'Lot Number', placeholder: 'Enter lot number', type: 'text' }
          ]
        },
        {
          id: 'Sysadmin_Post_Clone',
          name: 'Sysadmin-Post clone steps',
          description: 'Tests post-clone steps for sysadmin',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Sysadmin Post Clone'] }]
        },
      ],
    },
    {
      id: 'Other',
      name: 'Other',
      tests: [
        {
          id: 'Claim_Reasons',
          name: 'Claim Reasons',
          description: 'Tests claim reasons setup',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Claim Reasons'] }]
        },
        {
          id: 'Roles_Adding_Missing',
          name: 'Roles and Role inheritance, Adding Missing Role',
          description: 'Tests adding missing roles',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Roles Adding Missing'] },
            { name: 'roleName', label: 'Role Name', placeholder: 'Enter role name', type: 'text' }
          ]
        },
        {
          id: 'Roles_Finding_Missing',
          name: 'Roles and Role inheritance, Finding Missing Responsible Roles',
          description: 'Tests finding missing responsible roles',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Roles Finding Missing'] },
            { name: 'roleName', label: 'Role Name', placeholder: 'Enter role name', type: 'text' }
          ]
        },
        {
          id: 'Item_Creation_Sales',
          name: 'Item Creation (with Sales level step)',
          description: 'Tests item creation with sales level step',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Item Creation Sales'] },
            { name: 'itemCode', label: 'Item Code', placeholder: 'Enter item code', type: 'text' }
          ]
        },
        {
          id: 'Item_Creation_Without_Sales',
          name: 'Item Creation (without Sales level step)',
          description: 'Tests item creation without sales level step',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Item Creation Without Sales'] },
            { name: 'itemCode', label: 'Item Code', placeholder: 'Enter item code', type: 'text' }
          ]
        },
        {
          id: 'Asset_Group_Creation',
          name: 'Asset Group Creation',
          description: 'Tests asset group creation',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Asset Group Creation'] },
            { name: 'groupName', label: 'Group Name', placeholder: 'Enter group name', type: 'text' }
          ]
        },
        {
          id: 'Customer_Master_Division',
          name: 'Customer Master-Division Responsibility',
          description: 'Tests customer master division responsibility',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Customer Master Division'] },
            { name: 'customerId', label: 'Customer ID', placeholder: 'Enter customer ID', type: 'text' }
          ]
        },
        {
          id: 'Verifying_NXXX_Supplier',
          name: 'Verifying NXXX Supplier Data Librarian User',
          description: 'Tests verification of NXXX supplier data librarian user',
          icon: <VerifiedUserIcon />,
          color: '#4caf50',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Verifying NXXX Supplier'] },
            { name: 'userId', label: 'User ID', placeholder: 'Enter user ID', type: 'text' }
          ]
        },
        {
          id: 'Verifying_NXXX_Payables',
          name: 'Verifying NXXX Payables Inquiry',
          description: 'Tests verification of NXXX payables inquiry',
          icon: <VerifiedUserIcon />,
          color: '#4caf50',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Verifying NXXX Payables'] }]
        },
        {
          id: 'F067_Nultem_Spec',
          name: 'F067 - Nultem - Specification Mass Search and Replace',
          description: 'Tests specification mass search and replace',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['F067 Nultem Spec'] },
            { name: 'specId', label: 'Spec ID', placeholder: 'Enter spec ID', type: 'text' }
          ]
        },
        {
          id: 'NGS_132225_Responsibility',
          name: 'NGS-132225_SIngle/Multiple Responsibility add request and processed by the approver(Via UI)',
          description: 'Tests responsibility add request via UI',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['NGS 132225 Responsibility'] },
            { name: 'requestId', label: 'Request ID', placeholder: 'Enter request ID', type: 'text' }
          ]
        },
        {
          id: 'OSW_02_03_Update_Item',
          name: 'OSW-02, OSW-03 - Update item information (Add/Update manufacturing information and item stock collection plan)',
          description: 'Tests updating item information',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['OSW 02 03 Update Item'] },
            { name: 'itemId', label: 'Item ID', placeholder: 'Enter item ID', type: 'text' }
          ]
        },
        {
          id: 'OSW_03_OPM_Resource',
          name: 'OSW-03, Memberships is reporting that the OPM Resource "OTHER" is not available',
          description: 'Tests OPM resource availability',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['OSW 03 OPM Resource'] }]
        },
        {
          id: 'G1_02_Assign_Organization',
          name: 'G1-02/Assign to Organization',
          description: 'Tests assigning items to organization',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['G1 02 Assign Organization'] },
            { name: 'orgId', label: 'Organization ID', placeholder: 'Enter organization ID', type: 'text' }
          ]
        },
        {
          id: 'G1_02_Item_Search_Size',
          name: 'G1-02/Item Search by Size',
          description: 'Tests item search by size',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['G1 02 Item Search Size'] },
            { name: 'size', label: 'Size', placeholder: 'Enter size', type: 'text' }
          ]
        },
        {
          id: 'Simple_Search_Item',
          name: 'Simple Search for an item including base item',
          description: 'Tests simple search for items',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Simple Search Item'] },
            { name: 'itemName', label: 'Item Name', placeholder: 'Enter item name', type: 'text' }
          ]
        },
      ],
    },
    {
      id: 'COMM',
      name: 'COMM',
      tests: [
        {
          id: 'Generate_IPOs_Sales',
          name: 'Generate IPOs for Sales Order Lines',
          description: 'Tests generation of IPOs for sales order lines',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Generate IPOs Sales'] },
            { name: 'orderNumber', label: 'Order Number', placeholder: 'Enter order number', type: 'text' }
          ]
        },
        {
          id: 'cPOs_Release',
          name: 'cPOs Release',
          description: 'Tests release of cPOs',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['cPOs Release'] }]
        },
        {
          id: 'Generate_IPOs_Hold',
          name: 'Generate IPOs for Sales Order Lines - Apply hold on E',
          description: 'Tests applying hold on E for IPOs',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Generate IPOs Hold'] },
            { name: 'orderNumber', label: 'Order Number', placeholder: 'Enter order number', type: 'text' }
          ]
        },
        {
          id: 'PlateMill_Sales_Order',
          name: 'PlateMill-Sales order creation',
          description: 'Tests sales order creation for PlateMill',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['PlateMill Sales Order'] },
            { name: 'orderNumber', label: 'Order Number', placeholder: 'Enter order number', type: 'text' }
          ]
        },
        {
          id: 'FLAT_16_10_Forecasting',
          name: 'FLAT_16.10 creating and Forecasting PM Work order to Completion',
          description: 'Tests forecasting PM work order to completion',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['FLAT 16 10 Forecasting'] },
            { name: 'workOrderId', label: 'Work Order ID', placeholder: 'Enter work order ID', type: 'text' }
          ]
        },
      ],
    },
    {
      id: 'COMM_OSP_OrderEntry',
      name: 'COMM_OSP_OrderEntry',
      tests: [
        {
          id: 'Reprice_Hold_Release',
          name: 'Reprice Hold Release',
          description: 'Tests reprice hold release process',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Reprice Hold Release'] },
            { name: 'orderNumber', label: 'Order Number', placeholder: 'Enter order number', type: 'text' }
          ]
        },
      ],
    },
    {
      id: 'COMM_OSP_SalesOrderCreation',
      name: 'COMM_OSP_SalesOrderCreation(with Customer reference)',
      tests: [
        {
          id: 'Sales_Order_Creation_Sheetsmill',
          name: 'Sales Order Creation(sheetsmill)',
          description: 'Tests sales order creation for sheetsmill',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Sales Order Creation Sheetsmill'] },
            { name: 'customerNumber', label: 'Customer Number', placeholder: 'Enter customer number', type: 'text' }
          ]
        },
      ],
    },
    {
      id: 'P&S_PROD',
      name: 'Planning & Scheduling',
      tests: [
        {
          id: 'Schedule_Release_Pickle',
          name: 'Schedule & Release for Pickle 1&2 Line Schedule(SEM office-GUI)',
          description: 'Tests scheduling for pickle lines',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Schedule Release Pickle'] }]
        },
        {
          id: 'Heat_Release',
          name: 'Heat Release',
          description: 'Tests heat release process',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Heat Release'] },
            { name: 'heatNumber', label: 'Heat Number', placeholder: 'Enter heat number', type: 'text' }
          ]
        },
        {
          id: 'Pickle_1_2_Production',
          name: 'Pickle 1 & 2 Line Production',
          description: 'Tests production on pickle lines',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Pickle 1 2 Production'] }]
        },
        {
          id: 'Rolling_Mill_HR',
          name: 'Rolling Mill HR Production',
          description: 'Tests rolling mill HR production',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Rolling Mill HR'] }]
        },
        {
          id: 'Batch_Anneal',
          name: 'Batch Anneal process',
          description: 'Tests batch anneal process',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Batch Anneal'] }]
        },
        {
          id: 'Reversing_Mill_Temper',
          name: 'Reversing Mill/Temper Mill Line Production Process',
          description: 'Tests reversing and temper mill production',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Reversing Mill Temper'] }]
        },
        {
          id: 'Galvanizing_1_2',
          name: 'Galvanizing 1 & 2 Line Production',
          description: 'Tests galvanizing line production',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Galvanizing 1 2'] }]
        },
        {
          id: 'Skin_Pass_Production',
          name: 'Skin Pass Line Production process',
          description: 'Tests skin pass line production',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Skin Pass Production'] }]
        },
      ],
    },
    {
      id: 'RMM_COMM_SHIP',
      name: 'RMM',
      tests: [
        {
          id: 'FLAT_7_4_01_RMM_Purchase',
          name: 'FLAT_7.4_01_RMM_Purchase Refactory - Non-Brokered by TRUCK Shipping Report',
          description: 'Tests RMM purchase refactory shipping report',
          icon: <LocalShippingIcon />,
          color: '#ff9800',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['FLAT 7 4 01 RMM Purchase'] },
            { name: 'reportId', label: 'Report ID', placeholder: 'Enter report ID', type: 'text' }
          ]
        },
      ],
    },
    {
      id: 'MATHAND_SHIP',
      name: 'MATHAND',
      tests: [
        {
          id: 'Assign_Carrier',
          name: 'Assign a Carrier',
          description: 'Tests assigning a carrier for shipping',
          icon: <LocalShippingIcon />,
          color: '#ff9800',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Assign Carrier'] },
            { name: 'carrierId', label: 'Carrier ID', placeholder: 'Enter carrier ID', type: 'text' }
          ]
        },
        {
          id: 'GateHouse_Load_Execution',
          name: 'GateHouseEntry/LoadExecution/GateHouseExit (Truck)',
          description: 'Tests gatehouse entry and load execution for trucks',
          icon: <LocalShippingIcon />,
          color: '#ff9800',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['GateHouse Load Execution'] },
            { name: 'loadId', label: 'Load ID', placeholder: 'Enter load ID', type: 'text' }
          ]
        },
        {
          id: 'Create_Load_Truck',
          name: 'CREATE LOAD (Truck)',
          description: 'Tests creation of load for trucks',
          icon: <LocalShippingIcon />,
          color: '#ff9800',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Create Load Truck'] },
            { name: 'loadId', label: 'Load ID', placeholder: 'Enter load ID', type: 'text' }
          ]
        },
      ],
    },
    {
      id: 'MAINT_QUAL',
      name: 'MAINT_Qual',
      tests: [
        {
          id: 'FLAT_16_18_NuKiosk',
          name: 'FLAT_16.18 NuKiosk',
          description: 'Tests NuKiosk quality process',
          icon: <VerifiedUserIcon />,
          color: '#4caf50',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['FLAT 16 18 NuKiosk'] }]
        },
        {
          id: 'Quality_Validation',
          name: 'Quality validation process',
          description: 'Tests quality assurance and validation procedures',
          icon: <VerifiedUserIcon />,
          color: '#4caf50',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Quality Validation'] },
            { name: 'heatNumber', label: 'Heat Number', placeholder: 'Enter heat number', type: 'text' }
          ]
        },
      ],
    },
    {
      id: 'PROD_PROD',
      name: 'PROD [PROD]',
      tests: [
        {
          id: 'Schedule_Release_Skin_Pass',
          name: 'Schedule & Release AUTOMATIC Skin Pass Process(SEM office-GUI)',
          description: 'Tests automatic skin pass process scheduling',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Schedule Release Skin Pass'] }]
        },
        {
          id: 'Schedule_Release_RT_Mill',
          name: 'Schedule & Release for RT Mill Line Product type(SEM office-GUI)',
          description: 'Tests scheduling for RT mill line',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Schedule Release RT Mill'] }]
        },
        {
          id: 'Schedule_Release_Galv',
          name: 'Schedule & Release for Galv Line Product type(SEM office-GUI)',
          description: 'Tests scheduling for galvanizing line',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Schedule Release Galv'] }]
        },
      ],
    },
    {
      id: 'F2M',
      name: 'F2M (Finance to Manage)',
      tests: [
        {
          id: 'On_Hand_Inventory',
          name: 'On-hand Inventory Placement',
          description: 'Tests on-hand inventory placement',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['On Hand Inventory'] },
            { name: 'inventoryId', label: 'Inventory ID', placeholder: 'Enter inventory ID', type: 'text' }
          ]
        },
        {
          id: 'Production_Packing_Line',
          name: 'Production Packing Line',
          description: 'Tests production packing line process',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Production Packing Line'] }]
        },
        {
          id: 'Validation_Sales_Order_Telegrah',
          name: 'Validation of Sales Order in Telegrah',
          description: 'Tests sales order validation in Telegrah',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Validation Sales Order Telegrah'] },
            { name: 'orderNumber', label: 'Order Number', placeholder: 'Enter order number', type: 'text' }
          ]
        },
      ],
    },
    {
      id: 'FINT',
      name: 'FINT (Finance Integration)',
      tests: [
        {
          id: 'Blast_Paint_Schedule',
          name: 'Blast and Paint Line Schedule',
          description: 'Tests blast and paint line scheduling',
          icon: <BuildIcon />,
          color: '#17a2b8',
          inputs: [{ name: 'eventName', label: 'Event Name', type: 'select', options: ['Blast Paint Schedule'] }]
        },
      ],
    },
    {
      id: 'RMM_PURCH_RMM',
      name: 'RMM [PURCH] [RMM]',
      tests: [
        {
          id: 'Real_Time_Acknowledgement',
          name: 'Processing of Real Time Acknowledgement DJJ As(NuConnect)',
          description: 'Tests real-time acknowledgement processing',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Real Time Acknowledgement'] },
            { name: 'ackId', label: 'Acknowledgement ID', placeholder: 'Enter acknowledgement ID', type: 'text' }
          ]
        },
        {
          id: 'Update_Quote_NuMRO',
          name: 'Update the Quote by using NuMRO Sourcing',
          description: 'Tests updating quotes using NuMRO sourcing',
          icon: <StorageIcon />,
          color: '#3f51b5',
          inputs: [
            { name: 'eventName', label: 'Event Name', type: 'select', options: ['Update Quote NuMRO'] },
            { name: 'quoteId', label: 'Quote ID', placeholder: 'Enter quote ID', type: 'text' }
          ]
        },
      ],
    },
  ];

  // -------------------------
  // Enhance tests by adding an extra DEX select field to every test (DEX field comes first)
  // -------------------------
  const enhanceTestsWithDex = (groups) =>
    groups.map((group) => ({
      ...group,
      tests: group.tests.map((test) => {
        if (!test.inputs.find((inp) => inp.name === 'dex')) {
          return {
            ...test,
            inputs: [
              {
                name: 'dex',
                label: 'DEX',
                type: 'select',
                options: ['Dex1', 'Dex2', 'Dex3', 'Dex4', 'Dex5', 'Dex6'],
              },
              ...test.inputs,
            ],
          };
        }
        return test;
      }),
    }));

  // Memoize TEST_GROUPS so they donâ€™t trigger repeated recalculations
  const TEST_GROUPS = useMemo(() => enhanceTestsWithDex(TEST_GROUPS_ORIGINAL), []);

  // -------------------------
  // Initialize test inputs on mount
  // -------------------------
  useEffect(() => {
    const initialInputs = {};
    TEST_GROUPS.forEach((group) => {
      group.tests.forEach((test) => {
        initialInputs[test.id] = test.inputs.reduce((acc, input) => {
          acc[input.name] = '';
          return acc;
        }, {});
      });
    });
    console.log('Initial test inputs:', initialInputs);
    setTestInputs(initialInputs);
  }, [TEST_GROUPS]);

  // -------------------------
  // Sample execution history (for demonstration)
  // -------------------------
  useEffect(() => {
    const sampleHistory = [
      { testId: 'Internal_Requisition_Standard', result: 'Passed', timestamp: new Date().toISOString(), duration: 120 },
      { testId: 'Drop_Ship_External', result: 'Failed', timestamp: new Date(Date.now() - 3600000).toISOString(), duration: 150 },
      { testId: 'Direct_Order_Entry_Truck_Express', result: 'Passed', timestamp: new Date(Date.now() - 7200000).toISOString(), duration: 90 },
    ];
    setExecutionHistory(sampleHistory);
  }, []);

  const handleInputChange = (testId, field, value) => {
    console.log(`Input change for test ${testId}, field ${field}: ${value}`);
    setTestInputs((prev) => ({
      ...prev,
      [testId]: { ...prev[testId], [field]: value },
    }));
  };

  const handleExpandClick = (groupId) => {
    console.log(`Toggling expand for group ${groupId}`);
    setExpanded((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleExpandTestClick = (testId) => {
    console.log(`Toggling expand for test ${testId}`);
    setExpandedTest((prev) => ({ ...prev, [testId]: !prev[testId] }));
  };

  const validateInputs = (testId) => {
    const test = TEST_GROUPS.flatMap((group) => group.tests).find((t) => t.id === testId);
    const isValid = test.inputs.every((input) => testInputs[testId]?.[input.name]?.trim());
    console.log(`Validating inputs for test ${testId}: ${isValid}`);
    return isValid;
  };

  // -------------------------
  // Polling mechanism using setInterval
  // -------------------------
  const startExecution = async (testId) => {
    console.log(`Starting execution for test ${testId}`);
    if (!validateInputs(testId)) {
      alert('Please fill in all required fields for this test');
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
      console.log('Fetching token...');
      const tokenFormData = new URLSearchParams();
      tokenFormData.append('grant_type', 'client_credentials');
      tokenFormData.append('client_id', 'XaS6nmGk70W35q6quyqTBw');
      tokenFormData.append('client_secret', 'C5_L1YSlJEuf9M_GnSXgUA-tHNs9z3HU6Ift9havYvoQ');
      const tokenResponse = await fetch(TOSCA_CONFIG.TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: tokenFormData,
      });
      if (!tokenResponse.ok) throw new Error(`Token request failed: ${tokenResponse.statusText}`);
      const tokenData = await tokenResponse.json();
      const token = tokenData.access_token;
      console.log('Token fetched:', token);
      setExecutionState((prev) => ({ ...prev, step: 2, token, progress: 30 }));

      const currentInputs = testInputs[testId];
      console.log('Current inputs:', currentInputs);
      const parameters = {
        ...Object.fromEntries(
          Object.entries(currentInputs)
            .filter(([k]) => k !== 'eventName')
            .map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v])
        ),
      };
      const executionBody = {
        projectName: "NBTToscaProject",
        executionEnvironment: "Dex",
        events: [{ eventId: currentInputs.eventName, parameters }],
        importResult: true,
        creator: "Lakshmi",
      };
      console.log('Execution body:', executionBody);
      const executionResponse = await fetch(TOSCA_CONFIG.EXECUTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Tricentis': 'OK', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(executionBody),
      });
      if (!executionResponse.ok) throw new Error(`Execution request failed: ${executionResponse.statusText}`);
      const executionData = await executionResponse.json();
      const executionId = executionData.ExecutionId;
      console.log('Execution ID:', executionId);
      setExecutionState((prev) => ({ ...prev, step: 3, executionId, progress: 50, status: 'Running' }));
      startPollingStatus(token, executionId);
    } catch (error) {
      console.error('Error in startExecution:', error);
      setExecutionState((prev) => ({ ...prev, error: error.message, loading: false }));
      alert(`Error executing test: ${error.message}`);
    }
  };

  const startPollingStatus = (token, executionId) => {
    const startTime = Date.now();
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    pollingIntervalRef.current = setInterval(async () => {
      if (Date.now() - startTime > 35 * 60 * 1000) {
        clearInterval(pollingIntervalRef.current);
        setExecutionState((prev) => ({
          ...prev,
          loading: false,
          error: 'Test execution timed out',
          status: 'Timeout',
          result: 'Failed',
        }));
        alert('Test execution timed out after 35 minutes');
        return;
      }

      try {
        const statusResponse = await fetch(`${TOSCA_CONFIG.STATUS_URL}/${executionId}/status`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'X-Tricentis': 'OK' },
        });
        if (!statusResponse.ok) {
          console.log('Status check not OK, will retry...');
          return;
        }
        const statusData = await statusResponse.json();
        console.log('Status data:', statusData);
        if (['Completed', 'Failed', 'Error'].includes(statusData.status)) {
          clearInterval(pollingIntervalRef.current);
          const newExecution = {
            testId: executionState.testToRun,
            result: statusData.status === 'Completed' ? (statusData.result || 'Passed') : 'Failed',
            timestamp: new Date().toISOString(),
            duration: Math.floor((Date.now() - startTime) / 1000),
          };
          setExecutionHistory((prev) => [newExecution, ...prev].slice(0, 5));
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
          alert(
            statusData.status === 'Completed'
              ? `Test execution completed: ${statusData.result || 'Passed'}`
              : `Test execution ${statusData.status.toLowerCase()}`
          );
        } else {
          setExecutionState((prev) => ({
            ...prev,
            status: statusData.status,
            progress: Math.min(90, prev.progress + 5),
          }));
        }
      } catch (error) {
        console.error('Error in polling execution status:', error);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  const getStatusIcon = (testId) => {
    if (executionState.testToRun !== testId)
      return <HourglassEmptyIcon color="disabled" fontSize="small" />;
    if (executionState.loading)
      return <CircularProgress size={14} />;
    if (executionState.error)
      return <ErrorIcon color="error" fontSize="small" />;
    if (executionState.result === 'Passed')
      return <CheckCircleIcon color="success" fontSize="small" />;
    if (executionState.result === 'Failed')
      return <ErrorIcon color="error" fontSize="small" />;
    return <HourglassEmptyIcon color="disabled" fontSize="small" />;
  };

  // Use our custom renderInputFieldsCustom function for uniform sizing
  const renderFields = (test) =>
    renderInputFieldsCustom(test, testInputs, handleInputChange, executionState);

  // -------------------------
  // Dashboard Analytics Calculations
  // -------------------------
  const totalTestCases = TEST_GROUPS.reduce((sum, group) => sum + group.tests.length, 0);
  const testsExecuted = executionHistory.length;
  const passedTests = executionHistory.filter((h) => h.result === 'Passed').length;
  const failedTests = executionHistory.filter((h) => h.result === 'Failed').length;
  const passRate = testsExecuted > 0 ? ((passedTests / testsExecuted) * 100).toFixed(1) : 0;
  const avgExecutionTime = testsExecuted > 0 ? (executionHistory.reduce((sum, h) => sum + h.duration, 0) / testsExecuted).toFixed(1) : 0;

  const pieData = {
    labels: ['Passed', 'Failed', 'Not Started'],
    datasets: [
      {
        data: [passedTests, failedTests, totalTestCases - testsExecuted],
        backgroundColor: ['#28A745', '#DC3545', '#B0BEC5'],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: TEST_GROUPS.map((group) => group.name),
    datasets: [
      {
        label: 'Passed Tests',
        data: TEST_GROUPS.map((group) => {
          const groupTests = group.tests.map((test) => test.id);
          return executionHistory.filter((h) => groupTests.includes(h.testId) && h.result === 'Passed').length;
        }),
        backgroundColor: '#28A745',
      },
      {
        label: 'Failed Tests',
        data: TEST_GROUPS.map((group) => {
          const groupTests = group.tests.map((test) => test.id);
          return executionHistory.filter((h) => groupTests.includes(h.testId) && h.result === 'Failed').length;
        }),
        backgroundColor: '#DC3545',
      },
    ],
  };

  // -------------------------
  // Filter and search logic
  // -------------------------
  const filteredGroups = TEST_GROUPS.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tests.some(
        (test) =>
          test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Passed' &&
        group.tests.some((test) => executionHistory.some((h) => h.testId === test.id && h.result === 'Passed'))) ||
      (filterStatus === 'Failed' &&
        group.tests.some((test) => executionHistory.some((h) => h.testId === test.id && h.result === 'Failed')));
    return matchesSearch && matchesStatus;
  });

  // -------------------------
  // Main Rendering
  // -------------------------
  return (
    <ErrorBoundary>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Top AppBar */}
          <AppBar
            position="static"
            sx={{
              background: 'linear-gradient(180deg, #2D3748 0%, #1A202C 100%)',
              boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
            }}
          >
            <Toolbar variant="dense" sx={{ justifyContent: 'center', position: 'relative' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#FFFFFF', fontSize: '1.2rem' }}>
                Automation Test Repository
              </Typography>
              {/* Go Back */}
              <Box sx={{ position: 'absolute', right: 16 }}>
                <GradientButton startIcon={<ArrowBackIcon />} onClick={onBack} size="small">
                  Go Back
                </GradientButton>
              </Box>
            </Toolbar>
          </AppBar>
		  
		  {/* Main 2-column area (sidebar + content), flush with the top bar */}
          <Box sx={{ flex: 4, display: 'flex', position: 'relative' }}>
            {/* Particles behind everything */}
            <Particles
              id="tsparticles-test-execution"
              init={particlesInit}
              options={particleOptions}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />

            <Grid container spacing={0} sx={{ flex: 1, margin: 0, width: '100%' }}>
              {/* Sidebar Column */}
              <Grid
                item
                xs={12}
                sm={3}
                md={2}
                sx={{
                  backgroundColor: '#006325',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'start',
                  p: 1,
                  zIndex: 2 // So it stays above the Particles
                }}
              >
                <Box sx={{ textAlign: 'center', width: '100%', mt: 1 }}>
                  <img
                    src={logo}
                    alt="Nucor Logo"
                    style={{
                      width: '100%',
                      maxWidth: '120px',
                      margin: '0 auto 20px auto',
                      display: 'block',
                      height:'35px'
                    }}
                  />
                  {/* If you had extra sidebar items or text, place them here */}
                  <Typography variant="body1" sx={{ fontSize: '0.8rem' }}>
                    
                  </Typography>
                  <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
                  {/* Additional nav or links */}
                </Box>
              </Grid>

            <Box sx={{ p: 0 }}>
              {/* Dashboard Section */}
              <NeumorphicCard sx={{ mt: 0, mb: 2, pt: 2, px: 6, pb: 3 }}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontSize: '1.5rem', color: 'text.primary' }}>
                    Execution Dashboard
                  </Typography>
                </Box>
                {executionHistory.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <CircularProgress size={20} sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      Loading dashboard data...
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {/* Dashboard Cards with decreased height (100px) */}
                    <Grid container spacing={9} justifyContent="center">
                      <Grid item xs={12} sm={6} md={3}>
                        <Tooltip title="Total number of test cases">
                          <NeumorphicCard sx={{ p: 2, textAlign: 'center', height: '80px',width:'200px' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              Total Test Cases
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                              {totalTestCases}
                            </Typography>
                          </NeumorphicCard>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Tooltip title="Executed test cases">
                          <NeumorphicCard sx={{ p: 2, textAlign: 'center', height: '80px' ,width:'200px'}}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              Tests Executed
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                              {testsExecuted}
                            </Typography>
                          </NeumorphicCard>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Tooltip title="Pass Rate">
                          <NeumorphicCard sx={{ p: 2, textAlign: 'center', height: '80px' ,width:'200px'}}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              Pass Rate
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: passRate > 70 ? 'success.main' : 'error.main' }}>
                              {passRate}%
                            </Typography>
                          </NeumorphicCard>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Tooltip title="Avg. Execution Time">
                          <NeumorphicCard sx={{ p: 2, textAlign: 'center', height: '80px',width:'200px' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              Avg. Execution Time
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                              {avgExecutionTime}s
                            </Typography>
                          </NeumorphicCard>
                        </Tooltip>
                      </Grid>
                    </Grid>

                    {/* Charts Section */}
                    <Box sx={{ mt: 3 }}>
                      <Grid container spacing={2} justifyContent="space-evenly">
                        <Grid item xs={12} md={6}>
                          <NeumorphicCard sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column', width: '500px' }}>
                            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.7rem', textAlign: 'center' }}>
                              Test Results Distribution
                            </Typography>
                            <Box sx={{ flexGrow: 1, position: 'relative' }}>
                              <Chart
                                type="pie"
                                data={pieData}
                                options={{
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      position: 'bottom',
                                      labels: { font: { size: 8 }, color: '#333', padding: 5 },
                                    },
                                    tooltip: {
                                      enabled: true,
                                      callbacks: { label: (context) => `${context.label}: ${context.raw}` },
                                    },
                                    title: {
                                      display: true,
                                      text: 'Test Results Distribution',
                                      font: { size: 10 },
                                      color: '#333',
                                      padding: { top: 3, bottom: 3 },
                                    },
                                  },
                                }}
                                height={250}
                              />
                            </Box>
                          </NeumorphicCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <NeumorphicCard sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column', width: '500px' }}>
                            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.7rem', textAlign: 'center' }}>
                              Tests by Group
                            </Typography>
                            <Box sx={{ flexGrow: 1, position: 'relative' }}>
                              <Chart
                                type="bar"
                                data={barData}
                                options={{
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: { position: 'bottom', labels: { font: { size: 8 }, color: '#333', padding: 5 } },
                                    tooltip: {
                                      enabled: true,
                                      callbacks: { label: (context) => `${context.dataset.label}: ${context.raw}` },
                                    },
                                    title: {
                                      display: true,
                                      text: 'Tests by Group',
                                      font: { size: 10 },
                                      color: '#333',
                                      padding: { top: 3, bottom: 3 },
                                    },
                                  },
                                  scales: {
                                    x: {
                                      title: { display: true, text: 'Test Groups', color: '#333', font: { size: 8 } },
                                      ticks: { color: '#333', maxRotation: 45, minRotation: 45, font: { size: 7 }, padding: 3 },
                                    },
                                    y: {
                                      title: { display: true, text: 'Number of Tests', color: '#333', font: { size: 8 } },
                                      ticks: { color: '#333', beginAtZero: true, font: { size: 7 } },
                                    },
                                  },
                                }}
                                height={300}
                              />
                            </Box>
                          </NeumorphicCard>
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                )}
              </NeumorphicCard>

              {/* Search Bar */}
              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search test cases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />,
                  }}
                  sx={{
                    width: '100%',
                    maxWidth: 300,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 2,
                    '& .MuiInputBase-root': { height: '32px', fontSize: '0.7rem' },
                  }}
                />
              </Box>

              {/* Test Groups List */}
              <NeumorphicCard sx={{ p: 1.5 }}>
                {filteredGroups.map((group) => (
                  <Box key={group.id} sx={{ mb: 1 }}>
                    {/* Group Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1, backgroundColor: '#F5F5F5', borderRadius: 1 }}>
                      <Avatar sx={{ bgcolor: group.tests[0].color, width: 24, height: 24, mr: 1 }}>
                        {group.tests[0].icon}
                      </Avatar>
                      <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '0.9rem', fontWeight: 600 }}>
                        {group.name} ({group.tests.length} tests)
                      </Typography>
                      <IconButton onClick={() => handleExpandClick(group.id)} size="small">
                        {expanded[group.id] ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                      </IconButton>
                    </Box>
                    {/* Group Collapse */}
                    <Collapse in={expanded[group.id]} timeout="auto" unmountOnExit>
                      <List dense>
                        {group.tests.map((test) => (
                          <Box key={test.id}>
                            {/* Test Case Header */}
                            <ListItem
                              sx={{ py: 0.5, borderBottom: '1px solid #eee' }}
                              secondaryAction={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Tooltip title={executionState.testToRun === test.id ? (executionState.error || executionState.status || 'Pending') : 'Not Started'}>
                                    {getStatusIcon(test.id)}
                                  </Tooltip>
                                  <IconButton edge="end" onClick={() => handleExpandTestClick(test.id)} size="small">
                                    {expandedTest[test.id] ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                  </IconButton>
                                </Box>
                              }
                            >
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: test.color, width: 24, height: 24 }}>{test.icon}</Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={test.name}
                                secondary={test.description}
                                primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: 500 }}
                                secondaryTypographyProps={{ fontSize: '0.6rem', color: 'text.secondary' }}
                              />
                            </ListItem>
                            {/* Test Case Expanded Fields */}
                            {expandedTest[test.id] && (
                              <Box sx={{ p: 1, backgroundColor: '#FAFAFA', borderRadius: 1, ml: 5, mr: 2 }}>
                                {renderFields(test)}
                                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <GradientButton
                                    size="small"
                                    onClick={() => startExecution(test.id)}
                                    disabled={executionState.loading && executionState.testToRun === test.id}
                                    startIcon={<PlayArrowIcon />}
                                  >
                                    Run Test
                                  </GradientButton>
                                  {executionState.testToRun === test.id && executionState.progress > 0 && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <CircularProgress variant="determinate" value={executionState.progress} size={20} sx={{ mr: 1 }} />
                                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                        {executionState.progress}%
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                                {executionState.testToRun === test.id && executionState.result && (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                      Result: <Chip label={executionState.result} color={executionState.result === 'Passed' ? 'success' : 'error'} size="small" />
                                    </Typography>
                                  </Box>
                                )}
                                {executionState.testToRun === test.id && executionState.error && (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption" color="error" sx={{ fontSize: '0.7rem' }}>
                                      Error: {executionState.error}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            )}
                          </Box>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                ))}
              </NeumorphicCard>

              {/* Recent Activity */}
              <NeumorphicCard sx={{ mt: 2, p: 1.5 }}>
                <Typography variant="h5" sx={{ fontSize: '1rem', mb: 1, color: 'text.primary' }}>
                  Recent Activity
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      {executionHistory.map((history, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ py: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TimelineIcon sx={{ mr: 1, color: history.result === 'Passed' ? 'success.main' : 'error.main', fontSize: '1rem' }} />
                              <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                                {TEST_GROUPS.flatMap((group) => group.tests).find((test) => test.id === history.testId)?.name || history.testId}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 0.5 }}>
                            <Chip
                              label={history.result}
                              color={history.result === 'Passed' ? 'success' : 'error'}
                              size="small"
                              sx={{ fontSize: '0.6rem' }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 0.5 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              {new Date(history.timestamp).toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 0.5 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              {history.duration}s
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                      {executionHistory.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              No recent activity
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </NeumorphicCard>
            </Box>
          </Grid>
          </Box>
        </Box>
      </motion.div>
    </ErrorBoundary>
  );
}

export default TestExecutionListPage;
