const stripe = require('stripe')('sk_test_51POOsRAtSJLPfYWYzKygHZrTqLVLZT1qeygJwmtRtEOcGFSuXW2elncPen7s33Bj05TVdAORvClGb22qoJI8IRqm00oMB0K7LZ');
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const NodeCache = require('node-cache');
const app = express();

app.use(bodyParser.json());

// Middleware to handle CORS
app.use(cors({
  origin: 'http://localhost:4200', // Replace with your actual frontend URL
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// Initialize cache
const inventoryCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// Your existing routes here

app.get('/home', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
});

app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  try {
    // Create an array to hold line item objects for Stripe
    const line_items = [];

    for (const item of req.body) {
      // Create a product
      const product = await stripe.products.create({
        name: item.name,
      });

      // Create a price for the product
      const price = await stripe.prices.create({
        unit_amount: item.price, // Price in cents
        currency: 'usd',
        product: product.id,
      });

      // Add the line item for the session
      line_items.push({
        price: price.id,
        quantity: item.quantity,
      });
    }

    console.log(line_items)
    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: line_items,
      mode: 'payment',
      return_url: `http://localhost:4200/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    console.log(session)

    res.send({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Error creating checkout session:', error); // Log the error for debugging
    res.status(500).send({ error: error.message });
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
          'Authorization': 'Bearer lsxs_at_KQGVErVSQZkq3464ieDKNwVMDehW6lVo'
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
      'Authorization': 'Bearer lsxs_at_KQGVErVSQZkq3464ieDKNwVMDehW6lVo' // Replace with dynamic token storage
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
