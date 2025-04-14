import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
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
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#F5F6F5' }
      }
    },
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
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 120, 212, 0.3)'
          },
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
            '& .MuiInputBase-input': {
              fontSize: '0.7rem',
              padding: '6px 8px',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.7rem',
          },
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#F5F5F5',
          color: '#333333',
          fontWeight: 600,
          fontSize: '0.7rem'
        },
        body: {
          color: '#333333',
          borderBottom: '1px solid #E0E0E0',
          fontSize: '0.7rem'
        },
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: '#F5F5F5' }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E0E0E0'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#666666',
          '&.Mui-selected': { color: '#0078D4' },
          fontSize: '0.7rem'
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiSelect-select': { fontSize: '0.7rem', padding: '6px 8px' },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { fontSize: '0.7rem' },
      },
    },
  },
});
