const stripe = require('stripe')('sk_test_51POOsRAtSJLPfYWYzKygHZrTqLVLZT1qeygJwmtRtEOcGFSuXW2elncPen7s33Bj05TVdAORvClGb22qoJI8IRqm00oMB0K7LZ');
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const NodeCache = require('node-cache');
const nodemailer = require('nodemailer');
const app = express();

app.use(bodyParser.json());


app.use(cors({
  origin: 'http://localhost:4200', 
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// app.use(cors({
//   origin: 'https://theofficialwebsiteguys.github.io', // Replace with your actual frontend URL
//   credentials: true,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   allowedHeaders: 'Content-Type,Authorization'
// }));

const EXCHANGE_RATES = {
  EUR: 0.85,
  GBP: 0.75
};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: 'theofficialwebsiteguys@gmail.com',
    pass: 'tshz rgqz yyhn tiwg'
  }
});

// Initialize cache
const inventoryCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// Your existing routes here

app.get('/home', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
});


// Endpoint to handle signup and create a discount coupon
app.post('/api/signup', async (req, res) => {
  const { email } = req.body;

  try {
    // Create a new customer in Stripe
    const customer = await stripe.customers.create({
      email: email,
    });

    // Create a 5% discount coupon
    const coupon = await stripe.coupons.create({
      percent_off: 5,
      duration: 'once', // The coupon can be used only once
    });

    // Create a promotion code for the coupon
    const promotionCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      max_redemptions: 1, // Ensure the coupon can be used only once
    });

    res.status(200).send({
      message: 'Customer created and discount assigned',
      customerId: customer.id,
      promotionCode: promotionCode.code,
    });
  } catch (error) {
    console.error('Error creating customer and coupon:', error);
    res.status(500).send({ error: error.message });
  }
});



app.post('/send-email', (req, res) => {
  const { name, email, phone, comment } = req.body;
  
  const mailOptions = {
    from: email,
    to: 'jaredhfinn@gmail.com',
    subject: `Contact form submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nComment: ${comment}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});


app.post('/create-checkout-session', async (req, res) => {
  const items = req.body.products;
  const currency = req.body.currency;
  const promotionCode = req.body.promotionCode; // Get the promotion code from the request body

  try {
    const line_items = [];

    for (const item of items) {
      let convertedPrice = item.price;

      if (currency.toLowerCase() !== 'usd') {
        const exchangeRate = EXCHANGE_RATES[currency.toUpperCase()];
        if (!exchangeRate) {
          throw new Error(`Exchange rate for ${currency} not found`);
        }
        convertedPrice = item.price * exchangeRate;
      }

      const product = await stripe.products.create({
        name: item.name,
      });

      const price = await stripe.prices.create({
        unit_amount: convertedPrice,
        currency: currency,
        product: product.id,
      });

      line_items.push({
        price: price.id,
        quantity: item.quantity,
      });
    }

    const shipping_options = [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 1500, currency: currency },
          display_name: 'Standard Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 7 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 2500, currency: currency },
          display_name: 'Express Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 1 },
            maximum: { unit: 'business_day', value: 2 },
          },
        },
      },
    ];

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: line_items,
      mode: 'payment',
      allow_promotion_codes: true,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: shipping_options,
      return_url: `http://localhost:4200/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.send({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send({ error: error.message });
  }
});


// app.post('/create-checkout-session', async (req, res) => {
//   const items = req.body.products;
//   const currency = req.body.currency;

//   if (!['usd', 'eur', 'gbp'].includes(currency.toLowerCase())) {
//     throw new Error('Unsupported currency');
//   }

//   try {
//     // Create an array to hold line item objects for Stripe
//     const line_items = [];

//     for (const item of items) {

//       let convertedPrice = item.price;

//       if (currency.toLowerCase() !== 'usd') {
//         const exchangeRate = EXCHANGE_RATES[currency.toUpperCase()];
//         if (!exchangeRate) {
//           throw new Error(`Exchange rate for ${currency} not found`);
//         }
//         convertedPrice = item.price * exchangeRate;
//         //priceInCents = Math.round(convertedPrice * 100); // Convert back to cents
//       }


//       // Create a product
//       const product = await stripe.products.create({
//         name: item.name,
//       });

//       // Create a price for the product
//       const price = await stripe.prices.create({
//         unit_amount: convertedPrice, // Price in cents
//         currency: currency,
//         product: product.id,
//       });

//       // Add the line item for the session
//       line_items.push({
//         price: price.id,
//         quantity: item.quantity,
//       });
//     }

//      // Define shipping options
//      const shipping_options = [
//       {
//         shipping_rate_data: {
//           type: 'fixed_amount',
//           fixed_amount: { amount: 1500, currency: currency }, // Shipping cost
//           display_name: 'Standard Shipping',
//           // Delivery estimate
//           delivery_estimate: {
//             minimum: { unit: 'business_day', value: 5 },
//             maximum: { unit: 'business_day', value: 7 },
//           },
//         },
//       },
//       {
//         shipping_rate_data: {
//           type: 'fixed_amount',
//           fixed_amount: { amount: 2500, currency: currency }, // Shipping cost
//           display_name: 'Express Shipping',
//           // Delivery estimate
//           delivery_estimate: {
//             minimum: { unit: 'business_day', value: 1 },
//             maximum: { unit: 'business_day', value: 2 },
//           },
//         },
//       },
//     ];

    
//     // Create the checkout session
//     const session = await stripe.checkout.sessions.create({
//       ui_mode: 'embedded',
//       line_items: line_items,
//       mode: 'payment',
//       shipping_address_collection: {
//         allowed_countries: ['US'],
//       },
//       shipping_options: shipping_options,
//       //return_url: `https://theofficialwebsiteguys.github.io/Limited-Hype/success?session_id={CHECKOUT_SESSION_ID}`,
//       return_url: `http://localhost:4200/success?session_id={CHECKOUT_SESSION_ID}`,
//     });


//     res.send({ clientSecret: session.client_secret });
//   } catch (error) {
//     console.error('Error creating checkout session:', error); // Log the error for debugging
//     res.status(500).send({ error: error.message });
//   }
// });

app.post('/api/checkout-session', async (req, res) => {
  const sessionId = req.query.session_id;
  const additionalData = req.body; // Handle any additional data sent in the body

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    await registerSale(req.body);
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to register the sale
async function registerSale(items) {
  const payload = {
    register_id: "06e94082-ed4f-11ee-f619-eb7970ceac4d",
    user_id: "0a4c4486-f925-11ee-fc19-eb79707a4d14",
    status: "SAVED",
    register_sale_products: items.map(item => ({
      product_id: item.lightspeedId,
      quantity: item.quantity,
      price: item.price,
      tax: item.price * 0.05500,
      tax_id: '062791b7-dd73-11ee-eaf5-fc25466965b1'
    }))
  };

  console.log(payload)

  try {
    const response = await axios.post('https://limitedhypellp.retail.lightspeed.app/api/register_sales', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer lsxs_pt_Onfr839n5jTDglw8JHanZbbx5Otk7qmL'
      }
    });
    console.log('Sale registered successfully:', response.data);
  } catch (error) {
    console.error('Error registering sale:', error);
  }
}

app.get('/api/products', async (req, res) => {
  let allProducts = [];
  let after = 0; // Initialize the cursor
  let hasMorePages = true;

  try {
    while (hasMorePages) {
      const response = await axios.get('https://limitedhypellp.retail.lightspeed.app/api/2.0/products', {
        headers: {
          'Authorization': 'Bearer lsxs_pt_Onfr839n5jTDglw8JHanZbbx5Otk7qmL'
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
      'Authorization': 'Bearer lsxs_pt_Onfr839n5jTDglw8JHanZbbx5Otk7qmL' // Replace with dynamic token storage
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
