import React from 'react';
import { Button as MuiButton } from '@mui/material';

function Button({ children, variant = 'contained', startIcon, onClick, disabled, size = 'small', ...props }) {
  return (
    <MuiButton
      variant={variant}
      startIcon={startIcon}
      onClick={onClick}
      disabled={disabled}
      size={size}
      {...props}
    >
      {children}
    </MuiButton>
  );
}

export default Button;