import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box, Container, Typography, TextField, Button, CircularProgress,
  CardContent, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { GlassCard } from '../utils/styledComponents';

export default function OtherSalesOrderPage({ onBack }) {
  const [existingOrder, setExistingOrder] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!existingOrder) {
      alert('Please enter an order number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h3" fontWeight="600" sx={{ fontSize: '1.5rem' }}>
            Other Sales Order
          </Typography>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack} size="small">
            Go Back
          </Button>
        </Box>
        <GlassCard sx={{ mt: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                p: 4,
                backgroundImage: 'linear-gradient(135deg, #E6F0FA 0%, #DCEBFF 100%)',
                color: '#333333',
                mb: 3
              }}
            >
              <Typography variant="h5" gutterBottom>
                Order Lookup
              </Typography>
              <Typography variant="body1">
                Enter an existing order number to view its details and status
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Order Number"
                placeholder="Enter order number or ID"
                value={existingOrder}
                onChange={(e) => setExistingOrder(e.target.value)}
                disabled={submitted || loading}
                sx={{ mb: 3 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {submitted ? (
                  <Box sx={{ textAlign: 'right' }}>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Order {existingOrder} retrieved successfully!
                    </Alert>
                    <Button variant="outlined" onClick={() => setSubmitted(false)}>
                      Search Another Order
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ minWidth: 120 }}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Submit'}
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </GlassCard>
      </Container>
    </motion.div>
  );
}
