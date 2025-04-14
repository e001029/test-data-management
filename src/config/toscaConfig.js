/* ---------------------------------------------------------------------------
   2) TOSCA EXECUTION CONFIGURATION
--------------------------------------------------------------------------- */

export const TOSCA_CONFIG = {
  TOKEN_URL: 'https://bnatossvr04.nucorsteel.local/tua/connect/token',
  EXECUTION_URL: 'https://bnatossvr04.nucorsteel.local/automationobjectservice/api/Execution/enqueue',
  STATUS_URL: 'https://bnatossvr04.nucorsteel.local/automationobjectservice/api/Execution',
  CREDENTIALS: {
    grant_type: 'client_credentials',
    client_id: 'XaS6nmGk70W35q6quyqTBw',
    client_secret: 'C5_L1YSlJEuf9M_GnSXgUA-tHNs9z3HU6Ift9havYvoQ',
  },
  TESTS: [
    { id: 'Commercial', name: 'Order Creation And Validation', description: 'Tests the creation and validation of orders', color: '#3f51b5' },
    { id: 'PSI', name: 'Caster And Production Process', description: 'Execute Caster/DRS, EAF, LMF Production Process', color: '#f44336' },
    { id: 'Shipping', name: 'Create Load And Shipping Process', description: 'Execute Create Load and Complete Shipping Process', color: '#4caf50' },
  ],
  CREATOR: 'Anthony',
};
