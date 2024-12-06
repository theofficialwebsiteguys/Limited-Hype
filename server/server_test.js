
require('dotenv').config();
//TEST
const stripe = require('stripe')('sk_test_51POOsRAtSJLPfYWYzKygHZrTqLVLZT1qeygJwmtRtEOcGFSuXW2elncPen7s33Bj05TVdAORvClGb22qoJI8IRqm00oMB0K7LZ');

//PROD
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//TEST
var shippo = require('shippo')('shippo_test_f32790b86652b02e3e470dbd3e852e790c76ee79');

//PROD
// var shippo = require('shippo')(process.env.SHIPPO_KEY);

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const NodeCache = require('node-cache');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const lightspeedToken = process.env.LIGHTSPEED_API_TOKEN;

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

// const allowedOrigins = ['https://ltdhype.com', 'https://www.ltdhype.com'];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin, like mobile apps or curl requests
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not allow access from the specified origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   allowedHeaders: 'Content-Type,Authorization'
// }));

// app.use(cors({
//   origin: 'https://ltdhype.com', // Replace with your actual frontend URL
//   credentials: true,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   allowedHeaders: 'Content-Type,Authorization'
// }));

const EXCHANGE_RATES = {
  EUR: 0.85,
  GBP: 0.75
};

// Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // or your email provider
//   auth: {
//     user: 'ltdhypekittery.com@gmail.com',
//     pass: process.env.EMAIL_PASSWORD
//   }
// });

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: 'theofficialwebsiteguys@gmail.com',
    pass: 'oice dnzw nptu ctwe'
  }
});

const orderStore = {}; // In-memory store


// Initialize cache
const inventoryCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// Function to clear the node-cache
const clearCache = () => {
  inventoryCache.flushAll();
  console.log('Cache cleared on server');
};

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
    // const coupon = await stripe.coupons.create({
    //   percent_off: 5,
    //   duration: 'once', // The coupon can be used only once
    // });

    // Create a promotion code for the coupon
    // const promotionCode = await stripe.promotionCodes.create({
    //   coupon: coupon.id,
    //   max_redemptions: 1, // Ensure the coupon can be used only once
    // });

    res.status(200).send({
      message: 'Customer created',
      customerId: customer.id,
      //promotionCode: promotionCode.code,
    });
  } catch (error) {
    console.error('Error creating customer');
    res.status(500).send({ error: error.message });
  }
});



app.post('/send-email', (req, res) => {
  const { name, email, phone, comment } = req.body;
  
  const mailOptions = {
    from: email,
    TO: 'theofficialwebsiteguys@gmail.com',
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

app.post('/send-confirm-email', (req, res) => {
  const { orderNo, products, email } = req.body;

   // Format products into a readable HTML string
   const productDetailsText = products.map(product => {
    return `Name: ${product.name}, Quantity: ${product.quantity}, Price: $${product.price}`;
  }).join('\n');

  const productDetailsHtml = orderStore[orderNo].map(product => {
    return `<p><strong>Name:</strong> ${product.name}<br><strong>Quantity:</strong> ${product.quantity}<br><strong>Price:</strong> $${product.price}</p>`;
  }).join('');

  const mailOptions = {
    from: email,
    to: `${email}`,
    subject: `Confirmation Order - ${orderNo}`,
    text: `Order No: ${orderNo}\nProducts:\n${productDetailsText}\n`,
    html: `<h1><strong>ALL SALES FINAL. No refunds or exchanges.</h1>
          <p><strong>Order #:</strong> ${orderNo}</p>
           <p><strong>Products:</strong></p>
           ${productDetailsHtml}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

app.post('/create-checkout-session', async (req, res) => {
  const { lineItems, currency, address } = req.body;

      // Define the sender's address
    const addressFrom = {
      name: "Limited Hype",
      street1: "345 US-1",
      city: "Kittery",
      state: "ME",
      zip: "03904",
      country: "US"
    };

    const addressTo = {
      name: address.name,
      street1: address.address.line1,
      street2: address.address.line2,
      city: address.address.city,
      state: address.address.state,
      zip: address.address.postal_code,
      country: address.address.country
    };

    // Aggregate parcel details based on items
    const totalWeight = lineItems.reduce((sum, item) => sum + item.weight, 0);
    const maxLength = Math.max(...lineItems.map(item => item.length));
    const maxWidth = Math.max(...lineItems.map(item => item.width));
    const maxHeight = Math.max(...lineItems.map(item => item.height));

    var parcel = {
      length: 0,
      width: 0,
      height: 0,
      distance_unit: "in",
      weight: 0,
      mass_unit: "lb"
    };


    
  try {
    const line_items = [];
    const taxRateId = 'txr_1PRiu0AtSJLPfYWYtoTbQLGC';
    // const taxRateId = 'txr_1PUUb7AtSJLPfYWY2kGnnoov';

    console.log(JSON.stringify(lineItems))

    for (const item of lineItems) {

      if(item.category == 'New Shoes' || item.category == 'Used Shoes'){
        parcel.length = parcel.length + 14;
        parcel.width = parcel.width + 10;
        parcel.height = parcel.height + 6 * item.quantity;
        parcel.weight = parcel.weight + 4 * item.quantity;
      }else if(item.category == 'Shorts'){
        parcel.length = parcel.length + 10;
        parcel.width = parcel.width + 7;
        parcel.height = parcel.height + 2 * item.quantity;
        parcel.weight = parcel.weight + .25 * item.quantity;
      }else if(item.category == 'Hoodies'){
        parcel.length = parcel.length + 14;
        parcel.width = parcel.width + 10;
        parcel.height = parcel.height + 4 * item.quantity;
        parcel.weight = parcel.weight + 2 * item.quantity;
      }else if(item.category == 'T-Shirts'){
        parcel.length = parcel.length + 10;
        parcel.width = parcel.width + 7;
        parcel.height = parcel.height + 2 * item.quantity;
        parcel.weight = parcel.weight + .75 * item.quantity;
      }else if(item.category == 'Hats'){
        parcel.length = parcel.length + 10;
        parcel.width = parcel.width + 8;
        parcel.height = parcel.height + 6 * item.quantity;
        parcel.weight = parcel.weight + .5 * item.quantity;
      }else{
        parcel.length = parcel.length + 14;
        parcel.width = parcel.width + 10;
        parcel.height = parcel.height + 6 * item.quantity;
        parcel.weight = parcel.weight + 4 * item.quantity;
      }

      console.log(parcel)

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
        tax_rates: [taxRateId],
      });
    }

    // Fetch shipping rates from Shippo
    const shippingRates = await getShippingRates(addressFrom, addressTo, [parcel]);

     // Filter for UPS Ground and two fastest options
     const upsGroundRate = shippingRates.find(rate => rate.provider === 'UPS' && rate.servicelevel.name.includes('Ground'));
     const fastestRates = shippingRates
       .filter(rate => rate.provider === 'UPS' && rate.servicelevel.name !== 'Ground')
       .sort((a, b) => a.estimated_days - b.estimated_days)
       .slice(0, 2);

       //console.log(upsGroundRate);
       //console.log(fastestRates);

    // const shipping_options = [upsGroundRate, ...fastestRates].filter(Boolean).map(rate => ({
    //   shipping_rate_data: {
    //     type: 'fixed_amount',
    //     fixed_amount: { amount: Math.round(rate.amount * 100), currency: currency },
    //     display_name: rate.servicelevel.name,
    //     delivery_estimate: {
    //       minimum: { unit: 'day', value: rate.estimated_days },
    //       maximum: { unit: 'day', value: rate.estimated_days },
    //     },
    //   },
    // }));

    const shipping_options = [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: Math.round(upsGroundRate.amount * 100), currency: currency }, // Shipping cost
                display_name: upsGroundRate.servicelevel.display_name,
                // Delivery estimate
                delivery_estimate: {
                  minimum: { unit: 'business_day', value: 1 },
                  maximum: { unit: 'business_day', value: 5 },
                },
              },
            },
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: Math.round(fastestRates[0].amount * 100), currency: currency }, // Shipping cost
                display_name: fastestRates[0].servicelevel.display_name,
                // Delivery estimate
                delivery_estimate: {
                  minimum: { unit: 'business_day', value: 1 },
                  maximum: { unit: 'business_day', value: 2 },
                },
              },
            },
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: Math.round(fastestRates[1].amount * 100), currency: currency }, // Shipping cost
                display_name: fastestRates[1].servicelevel.display_name,
                // Delivery estimate
                delivery_estimate: {
                  minimum: { unit: 'business_day', value: 1 },
                  maximum: { unit: 'business_day', value: 2 },
                },
              },
            },
          ];

  const orderId = generateUniqueOrderId();

  orderStore[orderId] = lineItems;

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    payment_method_types: ['card'],
    line_items: line_items,
    mode: 'payment',
    // shipping_address_collection: {
    //   allowed_countries: ['US'],
    // },
    billing_address_collection: 'required',
    shipping_options: shipping_options,
    custom_text: {
      submit: {
        message: 'Prices include 5.5% tax', // Display a note indicating the tax is included
      },
    },
    payment_intent_data: {
      shipping: {
        name: addressTo.name,
        address: {
          line1: addressTo.street1,
          line2: addressTo.street2,
          city: addressTo.city,
          state: addressTo.state,
          postal_code: addressTo.zip,
          country: addressTo.country,
        }
      },
      metadata: {
        order_id: orderId,
        line_items: JSON.stringify(lineItems)
      }
    },
    metadata: {
      order_id: orderId,
      variants: JSON.stringify(lineItems)
    },
    return_url: `http://localhost:4200/success?session_id={CHECKOUT_SESSION_ID}`,
    //return_url: `https://theofficialwebsiteguys.github.io/success?session_id={CHECKOUT_SESSION_ID}`
    // return_url: `https://ltdhype.com/success?session_id={CHECKOUT_SESSION_ID}`
  });

    //console.log(session)

  res.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Error creating checkout session:', error); // Log the error for debugging
    res.status(500).send({ error: error.message });
  }
});


function generateUniqueOrderId() {
  const timestamp = Date.now().toString(); // Get current timestamp
  const randomString = crypto.randomBytes(4).toString('hex'); // Generate a random string
  const orderId = `ORDER-${timestamp}-${randomString}`; // Combine to form the unique order ID

  return orderId;
}



app.post('/get-shipping-rates', async (req, res) => {
  const { shippingAddress, currency } = req.body;

  const addressFrom = {
    name: "Limited Hype",
    street1: "345 US-1",
    city: "Kittery",
    state: "ME",
    zip: "03904",
    country: "US"
  };

  const addressTo = {
    name: shippingAddress.name,
    street1: shippingAddress.line1,
    city: shippingAddress.city,
    state: shippingAddress.state,
    zip: shippingAddress.postal_code,
    country: shippingAddress.country
  };

  const parcel = {
    length: "12",
    width: "6",
    height: "4",
    distance_unit: "in",
    weight: 5,
    mass_unit: "lb"
  };

  try {
    const shippingRates = await getShippingRates(addressFrom, addressTo, [parcel]);

    const upsGroundRate = shippingRates.find(rate => rate.provider === 'UPS' && rate.servicelevel.name.includes('Ground'));
    const fastestRates = shippingRates
      .filter(rate => rate.provider === 'UPS' && rate.servicelevel.name !== 'Ground')
      .sort((a, b) => a.estimated_days - b.estimated_days)
      .slice(0, 2);

    const shippingOptions = [upsGroundRate, ...fastestRates].filter(Boolean).map(rate => ({
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: { amount: Math.round(rate.amount * 100), currency: currency },
        display_name: rate.servicelevel.name,
        delivery_estimate: {
          minimum: { unit: 'day', value: rate.estimated_days },
          maximum: { unit: 'day', value: rate.estimated_days },
        },
      },
    }));

    res.send(shippingOptions);
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    res.status(500).send({ error: error.message });
  }
});


async function getShippingRates(addressFrom, addressTo, parcels) {
  try {
    const shipment = await shippo.shipment.create({
      address_from: addressFrom,
      address_to: addressTo,
      parcels: parcels,
      async: false
    });

    const rates = shipment.rates;
    return rates;
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    throw error;
  }
}



app.post('/api/checkout-session', async (req, res) => {
  const sessionId = req.query.session_id;
  const additionalData = req.body; // Handle any additional data sent in the body

  console.log("AdditionalData Line Items: ", JSON.stringify(additionalData));

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    await registerSale(orderStore[session.metadata.order_id]);

    clearCache();
    
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
      product_id: item.product_id,
      quantity: item.quantity,
      price: (item.price * item.quantity)/100,
      tax: ((item.price * item.quantity)/100) * 0.05500,
      tax_id: '062791b7-dd73-11ee-eaf5-fc25466965b1'
    }))
  };

  try {
    const response = await axios.post('https://limitedhypellp.retail.lightspeed.app/api/register_sales', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LIGHTSPEED_API_TOKEN}`
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
          'Authorization': `Bearer ${process.env.LIGHTSPEED_API_TOKEN}`
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


    //Assign Images of all parent products


    // Fetch inventory for all products
    // const inventoryRequests = allProducts.map(product =>
    //   getInventory(product.id)
    // );
    // const inventories = await Promise.all(inventoryRequests);


    // // Filter products based on inventory
    // const productsWithInventory = allProducts.filter((product, index) => {
    //   return inventories[index].data.some(item => item.current_amount > 0);
    // }

    // );

    res.json(allProducts);
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




app.get('/api/products/inventory', async (req, res) => {
  let allInventory = [];
  let after = 0; // Initialize the cursor
  let hasMorePages = true;

  try {
    while (hasMorePages) {
      const response = await axios.get(`https://limitedhypellp.retail.lightspeed.app/api/2.0/inventory`, {
        headers: {
          'Authorization': `Bearer ${process.env.LIGHTSPEED_API_TOKEN}`
        },
        params: {
          after: after
        }
      });

      const inventory = response.data.data;
      const versionInfo = response.data.version;

      if (inventory && inventory.length > 0) {
        allInventory = allInventory.concat(inventory);
        after = versionInfo.max; // Use the max version number for the next request
        console.log(`Fetched ${allInventory.length} inventory items so far, next after=${after}`);
      } else {
        hasMorePages = false;
      }
    }

    res.json(allInventory);
  } catch (error) {
    console.error('Error fetching inventory:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    res.status(500).json({ message: 'Error fetching inventory', error: error.message });
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
      'Authorization': `Bearer ${process.env.LIGHTSPEED_API_TOKEN}`
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
