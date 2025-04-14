import React from 'react';
import { Card as MuiCard, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from './Button';

const GlassCard = styled(MuiCard)(({ theme }) => ({
  background: '#FFFFFF',
  border: '1px solid #E0E0E0',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  borderRadius: 8,
  transition: 'box-shadow 0.3s ease',
  '&:hover': { boxShadow: '0 6px 20px rgba(0, 120, 212, 0.2)' },
}));

function Card({ title, description, icon, color, onClick }) {
  return (
    <GlassCard
      onClick={onClick}
      sx={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', cursor: 'pointer' }}
    >
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -70%)', color }}>
        {icon}
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight="600" gutterBottom sx={{ fontSize: '1.2rem' }}>
          {title}
        </Typography>
        <Typography variant="body1">{description}</Typography>
        <Button variant="outlined" sx={{ mt: 2 }}>
          Select
        </Button>
      </CardContent>
    </GlassCard>
  );
}

export default Card;