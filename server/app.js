const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

// Routes placeholder
app.get('/', (req, res) => {
    res.send('KisanBazaar API is running...');
});

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const marketRatesRoutes = require('./routes/marketRates');
const paymentRoutes = require('./routes/payments');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/market-rates', marketRatesRoutes);
app.use('/api/payments', paymentRoutes);

// Export for Vercel
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
