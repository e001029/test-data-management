import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

export const GlassCard = styled(Card)(({ theme }) => ({
  background: '#FFFFFF',
  border: '1px solid #E0E0E0',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  borderRadius: 8,
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(0, 120, 212, 0.2)'
  }
}));
