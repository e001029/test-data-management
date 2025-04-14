/* ---------------------------------------------------------------------------
   1) MODULE FIELDS and moduleCategories
--------------------------------------------------------------------------- */

// Example fallback or actual definitions
export const moduleFields = {
  'EBS Value': [
    'LineCount', 'CustomerNumber', 'CustomerPO', 'OrderType', 'PriceList', 'ShipToLocation', 'FreightTerms',
    'Legacy/Random OrderNumber', 'Result=>', 'Expected Sales Order Number',
  ],
  'EBS-Attribute': ['Ordered Item', 'Quantity', 'UOM', 'ShippingMethod', 'Request Date'],
  'Sales and Product Attributes': [
    'Product', 'Form', 'EBS Quality', 'Degas', 'Roll Process', 'Heat Treatment', 'Customer Part#', 'End Use',
    'End User', 'Stencil Free Text', 'MTR Free Text', 'LPN Weight Option', 'Purchased Plate', 'MTR Print Option',
    'Fine Grain', 'Al Killed', 'Laser Quality', 'Export Ship To', 'Flatness', 'Thickness', 'Thickness UOM',
    'Thickness Type', 'Thickness Tol Type', 'Thickness Aim', 'Thickness Aim Min', 'Thickness Aim Max', 'Width',
    'Width UOM', 'Width Type', 'Width Tol Type', 'Width Aim', 'Width Aim Min', 'Width Aim Max', 'Length',
    'Length UOM', 'Length Type', 'Length Tol Type', 'Length Aim', 'Length Aim Min', 'Length Aim Max', 'Edge Type',
    'Coil Wgt Min', 'Coil Wgt Max', 'Inner Diam Min', 'Inner Diam Max', 'Outer Diam Min', 'Outer Diam Max',
    'Ship Wgts UOM', 'Plate Finish', 'Painted/Primed', 'Primer Side', 'Masking', 'Do Not Mix', 'Inside Storage',
    'Magnetic Handling', 'Conditioning Allowed', 'Weld Repair Allowed', 'Plate Grinding Allowed', 'Min Red Ratio',
    'Pieces Per Lift Min', 'Pieces Per Lift Max', 'Pieces Per Lift Aim', 'Wgt Per Lift Min', 'Wgt Per Lift Max',
    'CE Mark', 'MTR Notarized', 'Trial Order', 'Remake Allowed', 'Grind Repair Allowed', 'PED Cert', 'Order Dressing',
    'Max Loads Per Day', 'Packaging', 'Die Stamp', 'Die Stamp Code', 'Stencil', 'Stencil Code', 'Primer Bottom Color',
    'Blasting Side', 'Paint Side', 'Primer Top Brand', 'Primer Top Color', 'Primer Bottom Brand',
  ],
  'Chem Modifications': [
    'Include/Exclude ChemMode', 'C Min', 'C Max', 'Mn Min', 'Mn Max', 'P Min', 'P Max', 'S Min', 'S Max', 'Si Min',
    'Si Max', 'Cu Min', 'Cu Max', 'Ni Min', 'Ni Max', 'Cr Min', 'Cr Max', 'Mo Min', 'Mo Max', 'Sn Min', 'Sn Max',
    'AI Min', 'AI Max', 'V Min', 'V Max', 'Nb Min', 'Nb Max', 'Ti Min', 'Ti Max', 'B Min', 'B Max', 'N Min', 'N Max',
    'Ca Min', 'Ca Max', 'Mg Min', 'Mg Max', 'Pb Min', 'Pb Max', 'As Min', 'As Max', 'Sb Min', 'Sb Max', 'Co Min',
    'Co Max', 'Alloy Restrictions',
  ],
  'Test Modifications-BALLISTICS': ['Ballistics Type', 'Frequency', 'Length Position', 'Width Position'],
  'Test Modifications-BEND': ['Bending Support Gap UOM', 'VALUE', 'Test Direction', 'Bend Radius', 'Bend Angle', 'Frequency', 'Length Position', 'Width Position'],
  'Test Modifications-CHARPY': [
    'Test Direction', 'Sample Size', 'Specimen Heat Treatment', 'Frequency', 'Length Position', 'Width Position',
    'Thickness Position', 'Test Temperature UOM', 'Test Temperature MAX', 'Energy - Min Average UOM', 'Energy - Min Average MIN',
    'Energy - Min UOM', 'Energy - Min MIN', 'Shear Avg (%) MIN', 'Shear Min (%) MIN', 'Lateral Expansion Average UOM',
    'Lateral Expansion Average MIN', 'Lateral Expansion Min UOM', 'Lateral Expansion Min MIN',
  ],
  'Test Modifications-CUST SAMPLE': ['Frequency', 'Length Position', 'Width Position', 'Length of Sample (Inches)', 'Width of Sample (Inches)'],
  'Test Modifications-DWTT': [
    'Test Direction', 'Frequency', 'Specimen Heat Treatment', 'Testing Standard', 'Length Position', 'Width Position',
    'Test Temperature-UOM', 'Test Temperature-MIN', 'Test Temperature-MAX', 'Shear (%)', 'Shear Avg (%)',
  ],
  'Test Modifications-DYNAMIC TEAR': [
    'Frequency', 'Specimen Heat Treatment (cycle code)', 'Test Direction', 'Testing Standard', 'Length Position',
    'Width Position', 'Thickness Position', 'Test Temperature-UOM', 'Test Temperature-MIN', 'Test Temperature-MAX',
    'Energy - Min Average UOM', 'Energy - Min Average MIN', 'Energy - Min Average MAX', 'Energy - Min UOM',
    'Energy - Min MIN', 'Energy - Min MAX',
  ],
  'Test Modifications-GRAIN SIZE': [
    'Type', 'Grain Size Method', 'Frequency', 'Length Position', 'Width Position', 'Thickness Position',
    'Grain Size Number MIN', 'Grain Size Number MAX', 'Grain Size Diameter MIN', 'Grain Size Diameter MAX',
  ],
  'Test Modifications-HARDNESS': ['Frequency', 'Length Position', 'Width Position', 'Thickness Position', 'Hardness MIN', 'Hardness MAX', 'Scale'],
  'Test Modifications-PROD_CHEM': ['Frequency', 'Length Position', 'Width Position'],
  'Test Modifications-TENSILE': [
    'Specimen Heat Treatment (cycle code)', 'Specimen Type', 'Test Direction', 'Frequency', 'Length Position',
    'Width Position', 'Thickness Position', 'Yield Strength UOM', 'Yield Strength MIN', 'Yield Strength MAX',
    '> Yield Type', 'Tensile Strength UOM', 'Tensile Strength MIN', 'Tensile Strength MAX', 'Yield / Tensile Ratio MIN',
    'Yield / Tensile Ratio MAX', 'Elongation (%) MIN', 'Elongation (%) MAX', 'EN Elongation (%) MIN', 'EN Elongation (%) MAX',
    'Reduction of Area (%) MIN', 'Reduction of Area (%) MAX',
  ],
  'Test Modifications-ULTRASONIC': ['UTMethod'],
  'Test Modifications-Z_TENSILE': ['ZTensileField1', 'ZTensileField2'],
  'TestModeName': ['TestModeField1', 'TestModeField2'],
};

export const modules = Object.keys(moduleFields);

export const moduleCategories = {
  'EBS': ['EBS Value', 'EBS-Attribute'],
  'Attributes': ['Sales and Product Attributes', 'Chem Modifications'],
  'Test Modifications': modules.filter(m => m.startsWith('Test Modifications')),
  'Other': ['TestModeName'],
};
