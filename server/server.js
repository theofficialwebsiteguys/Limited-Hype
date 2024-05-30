const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Use CORS to allow requests from your Angular app
app.use(cors({ origin: 'http://localhost:4200' }));

app.get('/api/products', async (req, res) => {
  try {
    const response = await axios.get('https://limitedhypellp.retail.lightspeed.app/api/2.0/products', {
      headers: {
        'Authorization': 'Bearer lsxs_pt_AESKmWBiELJqbrJyxMJ3jsS5yFBySTQR'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
