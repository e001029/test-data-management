import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';

// Temporary fallback to test
const fallbackModuleFields = {
  'EBS Value': ['LineCount', 'CustomerNumber'],
  'EBS-Attribute': ['Ordered Item', 'Quantity'],
};

let moduleFields;
try {
  moduleFields = require('../config/moduleFields').moduleFields;
  console.log('Imported moduleFields:', moduleFields);
} catch (error) {
  console.error('Failed to import moduleFields:', error);
  moduleFields = fallbackModuleFields;
}

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  console.log('AppContext moduleFields:', moduleFields);

  const [moduleData, setModuleData] = useState([]);
  const [activeModule, setActiveModule] = useState(() => {
    if (!moduleFields) {
      console.error('moduleFields is undefined or null');
      return 'EBS Value';
    }
    const keys = Object.keys(moduleFields);
    console.log('moduleFields keys:', keys);
    return keys.length > 0 ? keys[0] : 'EBS Value';
  });
  const [productType, setProductType] = useState('');
  const [environment, setEnvironment] = useState('');
  const [moduleFormInputs, setModuleFormInputs] = useState({});
  const [page, setPage] = useState('landing');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadDefaults = useCallback(() => {
    console.log('Running handleLoadDefaults, activeModule:', activeModule);
    if (!moduleFields || !activeModule || !moduleFields[activeModule]) {
      console.warn('Invalid moduleFields or activeModule', { moduleFields, activeModule });
      setModuleData([]);
      setModuleFormInputs({});
      setIsLoading(false);
      return;
    }
    const defaultData = moduleFields[activeModule].reduce(
      (acc, field) => ({
        ...acc,
        [field]: '',
      }),
      {}
    );
    console.log('Setting moduleData:', [defaultData]);
    setModuleData([defaultData]);
    setModuleFormInputs(defaultData);
    setProductType('Sheet Mill');
    setEnvironment('DEV');
    setIsLoading(false);
  }, [activeModule]);

  useEffect(() => {
    handleLoadDefaults();
  }, [handleLoadDefaults]);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  console.log('AppContext productType:', productType, 'environment:', environment);

  return (
    <AppContext.Provider
      value={{
        page,
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
        handleLoadDefaults,
        showSnackbar,
        snackbar,
        closeSnackbar,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};