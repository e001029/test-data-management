import React from 'react';
import { motion } from 'framer-motion';
import {
  Box, CardContent, Chip, Typography, FormControl,
  InputLabel, Select, MenuItem, Tooltip, Button
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import TuneIcon from '@mui/icons-material/Tune';
import { productTypeOptions, environmentOptions } from '../utils/globalOptions'; // Example
import { GlassCard } from '../utils/styledComponents'; // Example if you extracted your GlassCard style

// If you do not have a separate GlassCard, you can just inline the style or replicate it.

export default function GlobalTopBar({ productType, setProductType, environment, setEnvironment, onLoadDefaults }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <GlassCard sx={{ mb: 3, mr:0 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TuneIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" color="text.primary">Global Settings</Typography>
            </Box>
            <Chip
              variant="outlined"
              color="primary"
              size="small"
              label="Configuration"
              sx={{ borderRadius: 4, backgroundColor: '#FFFFFF', fontSize: '0.65rem' }}
            />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, alignItems: 'center' }}>
            {/* Product Type */}
            <FormControl size="small" sx={{ width: '100%' }}>
              <InputLabel>Product Type</InputLabel>
              <Select
                value={productType}
                label="Product Type"
                onChange={(e) => setProductType(e.target.value)}
                fullWidth
              >
                {productTypeOptions.map((pt) => (
                  <MenuItem key={pt} value={pt}>{pt}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Environment */}
            <FormControl size="small" sx={{ width: '100%' }}>
              <InputLabel>Environment</InputLabel>
              <Select
                value={environment}
                label="Environment"
                onChange={(e) => setEnvironment(e.target.value)}
                fullWidth
              >
                {environmentOptions.map((env) => (
                  <MenuItem key={env} value={env}>{env}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Load Defaults */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Tooltip title="Load default values for the selected product type">
                <Button
                  variant="contained"
                  onClick={onLoadDefaults}
                  size="small"
                  startIcon={<CloudDownloadIcon />}
                >
                  Load Defaults
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </GlassCard>
    </motion.div>
  );
}
