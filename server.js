require('dotenv').config(); // Add this at the VERY TOP
const express = require('express');
const cors = require('cors'); 
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(cors());
app.use(express.json());

// Add this verification
console.log('Environment Variables Loaded:');
console.log('CLIENT_ID:', process.env.CLIENT_ID ? '***' : 'Not Found');
console.log('AUTH_URL:', process.env.AUTH_URL);

// Modified token endpoint
app.post('/getToken', async (req, res) => {
  try {
    const response = await axios.post(`${process.env.AUTH_URL}/v2/token`, {
      grant_type: 'client_credentials',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    });
    res.json(response.data);
  } catch (error) {
    console.error('Auth Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Authentication failed',
      details: error.response?.data || error.message
    });
  }
});

// Modified data extension endpoint
app.get('/dataExtension', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const response = await axios.get(
      `${process.env.REST_URL}/data/v1/customobjectdata/key/${process.env.DATA_EXTENSION_KEY}/rowset`, 
      { headers: { Authorization: token } }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Data Extension Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Data fetch failed',
      details: error.response?.data || error.message
    });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running! Use /getToken or /dataExtension endpoints.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
