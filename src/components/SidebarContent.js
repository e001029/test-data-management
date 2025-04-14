import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Divider, Accordion, AccordionSummary,
  AccordionDetails, List, ListItemButton, ListItemText, Badge, Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { moduleCategories } from '../config/moduleFields';
import logo from '../assets/getsitelogo.png'; // If you have a local logo; adjust path

export default function SidebarContent({ activeModule, setActiveModule, moduleData }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    for (const [category, categoryModules] of Object.entries(moduleCategories)) {
      if (categoryModules.includes(activeModule)) {
        setExpandedCategory(category);
        break;
      }
    }
  }, [activeModule]);

  const handleCategoryToggle = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <Box sx={{ px: 2, py: 2, backgroundColor: '#006325', height: '100%', color: '#FFFFFF' }}>
      <Box sx={{ textAlign: 'Center', mb: 1 }}>
        <img
          src={logo}
          alt="Site Logo"
          style={{
            width: '200px',
            display: 'block',
            marginLeft: 0,
            marginBottom: '20px'
          }}
        />
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#FFFFFF' }}
        >
              Test Data Inputs
        </Typography>
        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
      </Box>
      {Object.entries(moduleCategories).map(([category, categoryModules]) => (
        <Accordion
          key={category}
          expanded={expandedCategory === category}
          onChange={() => handleCategoryToggle(category)}
          disableGutters
          elevation={0}
          sx={{
            backgroundColor: '#006325',
            '&:before': { display: 'none' },
            mb: 1,
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '8px'
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#FFFFFF' }} />}
            sx={{
              minHeight: 'auto',
              '&.Mui-expanded': {
                minHeight: 'auto',
                borderBottom: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            <Typography sx={{ fontWeight: 500, fontSize: '0.75rem', color: '#FFFFFF' }}>
              {category}
            </Typography>
            <Box sx={{ ml: 'auto', mr: 1 }}>
              <Chip
                label={categoryModules.reduce(
                  (count, mod) => count + (moduleData[mod]?.length || 0),
                  0
                )}
                size="small"
                color={
                  categoryModules.some((mod) => moduleData[mod]?.length > 0)
                    ? 'primary'
                    : 'default'
                }
                sx={{
                  height: 18,
                  '& .MuiChip-label': { px: 1, fontSize: '0.6rem' },
                  backgroundColor: categoryModules.some((mod) => moduleData[mod]?.length > 0)
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF'
                }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 1 }}>
            <List disablePadding dense>
              {categoryModules.map((mod) => {
                const hasData = moduleData[mod] && moduleData[mod].length > 0;
                return (
                  <ListItemButton
                    key={mod}
                    onClick={() => setActiveModule(mod)}
                    selected={activeModule === mod}
                    sx={{
                      mb: 0.5,
                      py: 0.5,
                      borderRadius: 1,
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                    }}
                    dense
                  >
                    <ListItemText
                      primary={mod}
                      primaryTypographyProps={{
                        fontSize: '0.7rem',
                        fontWeight: activeModule === mod ? 600 : 400,
                        color: activeModule === mod ? '#FFFFFF' : 'rgba(255, 255, 255, 0.9)'
                      }}
                    />
                    {hasData && (
                      <Badge
                        badgeContent={moduleData[mod].length}
                        color="primary"
                        max={99}
                        sx={{
                          '& .MuiBadge-badge': {
                            right: -4,
                            top: 6,
                            fontSize: '0.6rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)'
                          }
                        }}
                      />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
