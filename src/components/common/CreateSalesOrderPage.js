import React from 'react';
import { Box, Drawer } from '@mui/material';
import { useAppContext } from '../../context/AppContext';
import Sidebar from '../SidebarContent';
import GlobalTopBar from '../layout/GlobalTopBar';
import DashboardStats from '../DashboardStats';
import ModuleContent from '../ModuleContent';
import ToscaExecutionPanel from '../ToscaExecutionPanel';

function CreateSalesOrderPage() {
  const {
    setPage,
    productType,
    setProductType,
    environment,
    setEnvironment,
    activeModule,
    setActiveModule,
    moduleFormInputs,
    setModuleFormInputs,
    moduleData,
    setModuleData,
    isLoading,
  } = useAppContext();

  console.log('CreateSalesOrderPage moduleData:', moduleData);
  console.log('CreateSalesOrderPage activeModule:', activeModule);
  console.log('CreateSalesOrderPage productType:', productType);
  console.log('CreateSalesOrderPage environment:', environment);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const safeModuleData = Array.isArray(moduleData) ? moduleData : [];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{ width: 260, '& .MuiDrawer-paper': { width: 260 }, display: { xs: 'none', sm: 'block' } }}
      >
        <Sidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          moduleData={safeModuleData}
        />
      </Drawer>
      <Box sx={{ ml: { sm: '260px' }, p: 3 }}>
        <GlobalTopBar
          productType={productType || ''}
          setProductType={setProductType}
          environment={environment || ''}
          setEnvironment={setEnvironment}
        />
        <DashboardStats moduleData={safeModuleData} productType={productType} environment={environment} />
        <ModuleContent
          activeModule={activeModule}
          moduleFormInputs={moduleFormInputs}
          setModuleFormInputs={setModuleFormInputs}
          moduleData={safeModuleData}
          setModuleData={setModuleData}
          onBack={() => setPage('landing')}
        />
        <ToscaExecutionPanel moduleData={safeModuleData} productType={productType} environment={environment} />
      </Box>
    </Box>
  );
}

export default CreateSalesOrderPage;