// src/utils/api.js
export const fetchNetworkExcel = async (path, username, password, executionId) => {
    try {
      const response = await fetch('http://localhost:3001/api/network-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path,
          username,
          password,
          executionId,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch Excel data');
      }
  
      const data = await response.json();
      return {
        sheetName: data.sheetName,
        headers: data.headers,
        rows: data.rows,
      };
    } catch (error) {
      throw new Error(`Network Excel fetch failed: ${error.message}`);
    }
  };