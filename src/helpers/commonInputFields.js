// commonInputFields.js
import React from 'react';
import { Box, Divider, Typography, Grid, TextField, MenuItem, FormControl } from '@mui/material';

// Define a common style object for both select and text fields
const commonInputStyles = {
  fontSize: '0.7rem',
  height: 32,
  lineHeight: '32px',
  padding: '3 5px',
  width: '100%',
  minWidth: '100px',
};

/**
 * Renders input fields (both select and text) for a given test case.
 * This helper ensures that select and text fields have identical dimensions.
 *
 * @param {Object} test - The test case configuration (must contain an id and inputs).
 * @param {Object} testInputs - The current input values keyed by test id.
 * @param {Function} handleInputChange - Change handler function (testId, field, value).
 * @param {Object} executionState - Object containing at least a "loading" boolean.
 */
const renderInputFields = (test, testInputs, handleInputChange, executionState) => {
  if (!test.inputs) return null;
  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Divider sx={{ mb: 2 }} />
      <Typography
        variant="caption"
        gutterBottom
        color="text.secondary"
        sx={{ display: 'block', mb: 1.5 }}
      >
        Test Parameters
      </Typography>
      <Grid container spacing={2}>
        {test.inputs.map((input) => (
          <Grid item xs={12} sm={4} key={input.name}>
            {input.type === 'select' ? (
              <TextField
                select
                fullWidth
                variant="outlined"
                size="small"
                label={input.label}
                value={(testInputs[test.id] && testInputs[test.id][input.name]) || ''}
                onChange={(e) => handleInputChange(test.id, input.name, e.target.value)}
                disabled={executionState.loading}
                InputLabelProps={{
                  shrink: true,
                  sx: { ...commonInputStyles },
                }}
                InputProps={{
                  sx: { ...commonInputStyles },
                }}
                SelectProps={{
                  displayEmpty: true,
                  sx: { ...commonInputStyles, paddingRight: '32px' },
                  renderValue: (value) =>
                    value === '' ? (
                      <span style={{ color: 'rgba(0, 0, 0, 0.6)', ...commonInputStyles }}>
                        {input.label}
                      </span>
                    ) : (
                      value
                    ),
                }}
              >
                <MenuItem value="">
                  <em>{input.label}</em>
                </MenuItem>
                {input.options.map((option) => (
                  <MenuItem key={option} value={option} sx={{ ...commonInputStyles }}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label={input.label}
                placeholder={input.placeholder}
                value={(testInputs[test.id] && testInputs[test.id][input.name]) || ''}
                onChange={(e) => handleInputChange(test.id, input.name, e.target.value)}
                required
                disabled={executionState.loading}
                InputLabelProps={{
                  shrink: true,
                  sx: { ...commonInputStyles },
                }}
                InputProps={{
                  sx: { ...commonInputStyles, '& input': { padding: 0 } },
                }}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default renderInputFields;
