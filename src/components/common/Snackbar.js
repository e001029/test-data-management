import React from 'react';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';
import { useAppContext } from '../../context/AppContext';

function Snackbar() {
  const { snackbar, closeSnackbar } = useAppContext();

  return (
    <MuiSnackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </MuiSnackbar>
  );
}

export default Snackbar;