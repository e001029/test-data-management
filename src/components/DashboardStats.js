// src/components/DashboardStats.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Grid, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import DataObjectIcon from '@mui/icons-material/DataObject';
import StorageIcon from '@mui/icons-material/Storage';
import CategoryIcon from '@mui/icons-material/Category';
import BuildIcon from '@mui/icons-material/Build';

// Import modules from your config file
import { modules } from '../config/moduleFields';

// GlassCard style remains unchanged
const GlassCard = styled('div')(({ theme }) => ({
  background: '#FFFFFF',
  border: '1px solid #E0E0E0',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  borderRadius: 8,
  transition: 'box-shadow 0.3s ease',
  '&:hover': { boxShadow: '0 6px 20px rgba(0, 120, 212, 0.2)' },
  padding: theme.spacing(1),
}));

function DashboardStats({ moduleData = {}, productType, environment }) {
  // Safely compute the total number of rows
  const totalRows = Object.values(moduleData).reduce(
    (sum, rows) => sum + (rows?.length || 0),
    0
  );

  // Compute the number of modules that have data
  const populatedModules = Object.keys(moduleData).filter(
    (mod) => (moduleData[mod]?.length || 0) > 0
  ).length;

  // Total modules from config
  const totalModules = modules.length;

  // Identify the most populated module and its row count
  let mostPopulatedModule = '';
  let maxRows = 0;
  Object.entries(moduleData).forEach(([mod, rows]) => {
    const count = rows?.length || 0;
    if (count > maxRows) {
      maxRows = count;
      mostPopulatedModule = mod;
    }
  });

  // Define stat card data
  const stats = [
    { label: 'Total Rows', value: totalRows, icon: <DataObjectIcon />, color: '#0078D4' },
    { label: 'Modules Populated', value: `${populatedModules} / ${totalModules}`, icon: <StorageIcon />, color: '#00C4B4' },
    {
      label: 'Most Populated',
      value: mostPopulatedModule || 'None',
      subtitle: maxRows > 0 ? `${maxRows} rows` : '',
      icon: <CategoryIcon />,
      color: '#28A745',
    },
    { label: 'Environment', value: environment || 'Not Selected', icon: <BuildIcon />, color: '#17A2B8' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      {/* Outer container with zero horizontal margin */}
      <Box sx={{ mb: 3, ml: 0, mr: 0 }}>
        <Typography variant="h5" gutterBottom color="text.primary" sx={{ fontSize: '0.95rem' }}>
          Data Overview
        </Typography>
        {/* Grid container with justifyContent "flex-start" to start at left */}
        <Grid container spacing={6.40} justifyContent="flex-start">
          {stats.map((stat) => (
            <Grid item key={stat.label} xs={12} sm={6} md={3}>
              <GlassCard
                sx={{
                  width: '200px', // adjust these values as needed
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  mx: 'auto',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: stat.color, width: 36, height: 36 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.9rem' }}>
                    {stat.value}
                  </Typography>
                  {stat.subtitle && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                      {stat.subtitle}
                    </Typography>
                  )}
                </Box>
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </motion.div>
  );
}

export default DashboardStats;
