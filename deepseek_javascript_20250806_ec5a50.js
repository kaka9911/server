const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// Configuration - MetaApi
const META_API_TOKEN = 'YOUR_META_API_TOKEN'; // Replace with actual token
const ACCOUNT_ID = 'YOUR_ACCOUNT_ID';         // Replace with actual account ID
const SYMBOL = 'XAUUSD';

// Place Trade Endpoint
app.post('/api/trade', async (req, res) => {
  const { direction, lotSize } = req.body;

  try {
    // Create Order Payload
    const orderPayload = {
      symbol: SYMBOL,
      volume: parseFloat(lotSize),
      type: direction === 'BUY' ? 'ORDER_TYPE_BUY' : 'ORDER_TYPE_SELL',
      stopLoss: null,
      takeProfit: null,
      magic: Math.floor(Math.random() * 100000),
      comment: ''
    };

    // Send Trade Command via MetaApi
    const response = await axios.post(
      `https://api.metaapi.cloud/v1/trading/accounts/${ACCOUNT_ID}/orders`,
      orderPayload,
      {
        headers: {
          'Authorization': `Bearer ${META_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 200) {
      console.log(`Trade Executed: ${direction} | Lot: ${lotSize}`);
      res.status(200).json({ message: 'Trade executed successfully' });
    } else {
      throw new Error(`API returned status ${response.status}`);
    }
  } catch (error) {
    console.error('Trade Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});