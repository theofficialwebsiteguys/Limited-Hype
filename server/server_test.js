const express = require('express');
const axios = require('axios');
const cors = require('cors');
const NodeCache = require('node-cache');
const app = express();

// Use CORS to allow requests from your Angular app
app.use(cors({ origin: 'http://localhost:4200' }));

// Initialize cache
const inventoryCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// Replace these with your Lightspeed app details
const clientId = '66Yi7ku0rsjjhPUIQjkGVNSI169kfjm1';
const clientSecret = 'tRS7jH5NqhMEj6x0SWBhDfRXfEMB0kJc';
const redirectUri = 'http://localhost:3000/callback'; // Update with your actual Heroku URL

app.get('/home', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
});

// Step 3: Start the OAuth flow
app.get('/authorize', (req, res) => {
  const state = 'random_state_string'; // Replace with a real, securely generated random string
  const authorizationUrl = `https://secure.retail.lightspeed.app/connect?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
  res.redirect(authorizationUrl);
});

app.get('/callback', async (req, res) => {
  const authorizationCode = req.query.code;
  const state = req.query.state;

  // Validate state to prevent CSRF attacks

  console.log(`Authorization Code: ${authorizationCode}`);
  console.log(`State: ${state}`);

  try {
    const tokenResponse = await axios.post(
      'https://limitedhypellp.retail.lightspeed.app/api/1.0/token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: authorizationCode,
        grant_type: 'authorization_code'
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('Token Response:', tokenResponse.data);

    const accessToken = tokenResponse.data.access_token;

    // Check if the access token is present
    if (!accessToken) {
      throw new Error('Access token not found in the response');
    }

    // Store the access token securely
    // For example, you might store it in a session or a secure database
    console.log(accessToken);

    res.json({ message: 'Authorization successful', accessToken: accessToken });
  } catch (error) {
    console.error('Error exchanging authorization code for access token:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    }
    res.status(500).json({ message: 'Error exchanging authorization code for access token', error: error.message });
  }
});


app.get('/api/products', async (req, res) => {
  let allProducts = [];
  let after = 0; // Initialize the cursor
  let hasMorePages = true;

  try {
    while (hasMorePages) {
      const response = await axios.get('https://limitedhypellp.retail.lightspeed.app/api/2.0/products', {
        headers: {
          'Authorization': 'Bearer lsxs_pt_AESKmWBiELJqbrJyxMJ3jsS5yFBySTQR' // Replace with dynamic token storage
        },
        params: {
          after: after
        }
      });

      const products = response.data.data;
      const versionInfo = response.data.version;

      if (products && products.length > 0) {
        allProducts = allProducts.concat(products);
        after = versionInfo.max; // Use the max version number for the next request
        console.log(`Fetched ${allProducts.length} products so far, next after=${after}`);
      } else {
        hasMorePages = false;
      }
    }

    // Fetch inventory for all products
    const inventoryRequests = allProducts.map(product =>
      getInventory(product.id)
    );
    const inventories = await Promise.all(inventoryRequests);

    // Filter products based on inventory
    const productsWithInventory = allProducts.filter((product, index) =>
      inventories[index].data.some(item => item.current_amount > 0)
    );

    res.json(productsWithInventory);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

app.get('/api/products/:id/inventory', async (req, res) => {
  const productId = req.params.id;

  try {
    const inventory = await getInventory(productId);
    res.json(inventory);
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    res.status(500).json({ message: `Error fetching product with ID ${productId}`, error: error.message });
  }
});

async function getInventory(productId) {
  // Check if inventory is cached
  const cachedInventory = inventoryCache.get(productId);
  if (cachedInventory) {
    return cachedInventory;
  }

  // Fetch inventory from API
  const response = await axios.get(`https://limitedhypellp.retail.lightspeed.app/api/2.0/products/${productId}/inventory`, {
    headers: {
      'Authorization': 'Bearer lsxs_pt_AESKmWBiELJqbrJyxMJ3jsS5yFBySTQR' // Replace with dynamic token storage
    }
  });

  // Cache the inventory response
  inventoryCache.set(productId, response.data);

  return response.data;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
