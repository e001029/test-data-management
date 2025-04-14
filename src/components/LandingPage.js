import React from 'react';
import { motion } from 'framer-motion';
import {
  Box, Container, Typography, Grid, Button
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import SpeedIcon from '@mui/icons-material/Speed';
import { GlassCard } from '../utils/styledComponents';

export default function LandingPage({ onSelect }) {
  const cards = [
    {
      id: 'createSalesOrder',
      title: 'Create Sales Order',
      description: 'Create and manage test data for sales orders',
      icon: <StorageIcon sx={{ fontSize: 36 }} />,
      color: 'primary'
    },
    {
      id: 'otherSalesOrder',
      title: 'Other Sales Order',
      description: 'Work with existing orders and view their status',
      icon: <BuildIcon sx={{ fontSize: 36 }} />,
      color: 'secondary'
    },
    {
      id: 'testExecutionList',
      title: 'Test Execution List',
      description: 'View all automation test cases grouped by business process',
      icon: <SpeedIcon sx={{ fontSize: 36 }} />,
      color: 'info'
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          pt: 4,
          background: 'linear-gradient(135deg, #E6F0FA 0%, #FFFFFF 100%)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 6, maxWidth: '600px', px: 2 }}>
          <Typography
            variant="h2"
            fontWeight="700"
            sx={{
              mb: 2,
              background: 'linear-gradient(135deg, #333333 0%, #0078D4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2rem',
            }}
          >
            Test Data Management Portal
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1rem' }}>
            Create, manage, and test data efficiently in a unified environment
          </Typography>
        </Box>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {cards.map((card, index) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <GlassCard
                    onClick={() => onSelect(card.id)}
                    sx={{
                      height: 300,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      cursor: 'pointer'
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -70%)',
                        color: '#0078D4'
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Box
                      sx={{
                        p: 3,
                        color: '#333333',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        borderTop: '1px solid #E0E0E0'
                      }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight="600"
                        gutterBottom
                        sx={{ fontSize: '1.2rem' }}
                      >
                        {card.title}
                      </Typography>
                      <Typography variant="body1">{card.description}</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          mt: 2,
                          '&:hover': {
                            borderColor: '#005BA1',
                            backgroundColor: 'rgba(0, 120, 212, 0.1)',
                          }
                        }}
                      >
                        Select
                      </Button>
                    </Box>
                  </GlassCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Box sx={{ mt: 6, color: 'text.secondary', textAlign: 'center' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Test Data Management Portal | Version 2.0
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
}
