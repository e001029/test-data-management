import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Drawer, Box, Typography, Container } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

import { theme } from './theme';
import { modules } from './config/moduleFields';
import { buildInitialFormInputs, buildInitialModuleData } from './utils/initialState'; // Example
import GlobalTopBar from './components/GlobalTopBar';
import LandingPage from './components/LandingPage';
import OtherSalesOrderPage from './components/OtherSalesOrderPage';
import ModuleContent from './components/ModuleContent';
import SidebarContent from './components/SidebarContent';
import DashboardStats from './components/DashboardStats';
import ToscaExecutionPanel from './components/ToscaExecutionPanel';
import TestExecutionListPage from './pages/TestExecutionListPage';

function App() {
  const [page, setPage] = useState('landing');
  const [productType, setProductType] = useState('');
  const [environment, setEnvironment] = useState('');
  const [activeModule, setActiveModule] = useState(modules[0]);

  const [moduleFormInputs, setModuleFormInputs] = useState(buildInitialFormInputs());
  const [moduleData, setModuleData] = useState(buildInitialModuleData());

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // Particles
  const particleOptions = {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: '#0078D4' },
      shape: { type: 'circle' },
      opacity: { value: 0.7 },
      size: { value: 3 },
      move: { enable: true, speed: 1, direction: 'none', random: true },
      links: { enable: true, distance: 150, color: '#00C4B4', opacity: 0.5 },
    },
    interactivity: {
      events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
    },
  };
  const particlesInit = async (engine) => { await loadSlim(engine); };

  // ---------------------------------------------------------------------------
  // UPDATED: Load Defaults Function
  // ---------------------------------------------------------------------------
  const handleLoadDefaults = async () => {
    if (!productType) {
      showSnackbar('Select a Product Type first', 'warning');
      return;
    }
    try {
      showSnackbar('Loading defaults...', 'info');
      let defaults;
      try {
        // Attempt to fetch defaults from public folder
        const response = await fetch(`${process.env.PUBLIC_URL}/productType.json`);
        if (!response.ok) throw new Error(`Failed to fetch defaults: ${response.statusText}`);
        defaults = await response.json();
        console.log('Fetched defaults:', defaults);
      } catch (error) {
        console.error('Error fetching productType.json:', error);
        // Fallback defaults – keys here must match your module names as defined in moduleFields
        defaults = {
          'Skin Pass': {
            'EBS Value': [
              {
                'LineCount': '1',
                'CustomerNumber': 'CUST001',
                'CustomerPO': 'PO12345',
                'OrderType': 'Standard',
                'PriceList': 'US-DOMESTIC',
                'ShipToLocation': 'Chicago',
                'FreightTerms': 'FOB',
              },
              {
                'LineCount': '2',
                'CustomerNumber': 'CUST002',
                'CustomerPO': 'PO67890',
                'OrderType': 'Express',
                'PriceList': 'US-EXPORT',
                'ShipToLocation': 'Detroit',
                'FreightTerms': 'CIF',
              },
            ],
            'EBS-Attribute': [
              {
                'Ordered Item': 'STEEL-PLATE-A',
                'Quantity': '100',
                'UOM': 'Pieces',
                'ShippingMethod': 'Truck',
                'Request Date': '2023-12-01',
              },
              {
                'Ordered Item': 'STEEL-PLATE-B',
                'Quantity': '50',
                'UOM': 'Pieces',
                'ShippingMethod': 'Rail',
                'Request Date': '2023-12-15',
              },
            ],
            'Sales and Product Attributes': [
              { 'Product': 'Steel Plate A', 'Form': 'Coil', 'Thickness': '0.25', 'Width': '60', 'Length': '120' },
            ],
          },
          'Galvinzed': {
            'EBS Value': [
              {
                'LineCount': '1',
                'CustomerNumber': 'CUST100',
                'CustomerPO': 'GAL-PO-123',
                'OrderType': 'Standard',
                'PriceList': 'GALV-PRICE',
                'ShipToLocation': 'Pittsburgh',
                'FreightTerms': 'FOB',
              },
              {
                'LineCount': '2',
                'CustomerNumber': 'CUST200',
                'CustomerPO': 'GAL-PO-456',
                'OrderType': 'Express',
                'PriceList': 'GALV-EXPORT',
                'ShipToLocation': 'Cleveland',
                'FreightTerms': 'CIF',
              },
            ],
            'EBS-Attribute': [
              {
                'Ordered Item': 'GALV-SHEET-A',
                'Quantity': '200',
                'UOM': 'Pieces',
                'ShippingMethod': 'Truck',
                'Request Date': '2023-12-10',
              },
              {
                'Ordered Item': 'GALV-COIL-B',
                'Quantity': '75',
                'UOM': 'Tons',
                'ShippingMethod': 'Rail',
                'Request Date': '2023-12-20',
              },
            ],
            'Sales and Product Attributes': [
              { 'Product': 'Galvanized Sheet', 'Form': 'Sheet', 'Thickness': '0.18', 'Width': '48', 'Length': '96' },
            ],
            'Chem Modifications': [
              {
                'Include/Exclude ChemMode': 'Include',
                'C Min': '0.15',
                'C Max': '0.25',
                'Mn Min': '0.60',
                'Mn Max': '1.00',
              },
            ],
          },
        };
        console.log('Using fallback defaults:', defaults);
        showSnackbar('Using fallback defaults', 'info');
      }
      if (defaults[productType]) {
        const newModuleData = { ...buildInitialModuleData() };
        modules.forEach((mod) => {
          if (defaults[productType][mod]) {
            newModuleData[mod] = defaults[productType][mod].map(row => ({
              ...row,
              createdAt: new Date().toLocaleString(),
            }));
          }
        });
        setModuleData(newModuleData);
        const firstModuleWithData = modules.find(mod => defaults[productType][mod]?.length > 0);
        if (firstModuleWithData) setActiveModule(firstModuleWithData);
        showSnackbar(`Loaded defaults for ${productType}`, 'success');
      } else {
        showSnackbar('No defaults for this product type', 'warning');
      }
    } catch (error) {
      console.error('Error loading defaults:', error);
      showSnackbar('Failed to load defaults', 'error');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatePresence mode="wait">
        {page === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ position: 'relative', minHeight: '100vh' }}>
              <Particles
                id="tsparticles-landing"
                init={particlesInit}
                options={particleOptions}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <LandingPage onSelect={setPage} />
              </Box>
            </Box>
          </motion.div>
        )}
        {page === 'createSalesOrder' && (
          <motion.div
            key="create"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <Box sx={{ minHeight: '100vh', position: 'relative' }}>
              <Particles
                id="tsparticles-create"
                init={particlesInit}
                options={particleOptions}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                {/* Sidebar */}
                <Drawer
                  variant="permanent"
                  sx={{
                    width: 260,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box' },
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  <SidebarContent
                    activeModule={activeModule}
                    setActiveModule={setActiveModule}
                    moduleData={moduleData}
                  />
                </Drawer>

                <Box sx={{ ml: { sm: '260px' }, p: 3, width: { sm: `calc(100% - 260px)` } }}>
                  <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                    {/* Page Header */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(45deg, #333333 30%, #0078D4 90%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: 1,
                          fontSize: '1.5rem'
                        }}
                      >
                        Test Data Management And Tosca Test Execution
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Create, configure, and execute test data with precision
                      </Typography>
                    </Box>

                    {/* Global Settings */}
                    <GlobalTopBar
                      productType={productType}
                      setProductType={setProductType}
                      environment={environment}
                      setEnvironment={setEnvironment}
                      onLoadDefaults={handleLoadDefaults}
                    />

                    {/* Dashboard Stats */}
                    <DashboardStats
                      moduleData={moduleData}
                      productType={productType}
                      environment={environment}
                    />

                    {/* Module Content */}
                    <ModuleContent
                      activeModule={activeModule}
                      moduleFormInputs={moduleFormInputs}
                      setModuleFormInputs={setModuleFormInputs}
                      moduleData={moduleData}
                      setModuleData={setModuleData}
                      onBack={() => setPage('landing')}
                    />

                    {/* Tosca Execution */}
                    <ToscaExecutionPanel
                      moduleData={moduleData}
                      productType={productType}
                      environment={environment}
                      showSnackbar={showSnackbar}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.div>
        )}
        {page === 'otherSalesOrder' && (
          <motion.div
            key="other"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <Box sx={{ minHeight: '100vh', position: 'relative' }}>
              <Particles
                id="tsparticles-other"
                init={particlesInit}
                options={particleOptions}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <OtherSalesOrderPage onBack={() => setPage('landing')} />
              </Box>
            </Box>
          </motion.div>
        )}
        {page === 'testExecutionList' && (
          <motion.div
            key="testExecutionList"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <TestExecutionListPage onBack={() => setPage('landing')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optionally show your Snackbar here, if you want a global user message */}
    </ThemeProvider>
  );
}

export default App;
