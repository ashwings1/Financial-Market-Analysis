const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require('./config/dbConnection');
const PORT = process.env.PORT || 3500;
const axios = require("axios");
const cors = require('cors');

// Connect to MongoDB
connectDB();

app.use(cors());

// Built-in middleware to handle url encoded form data
app.use(express.urlencoded({ extended: true }));

// Built-in middleware for json
app.use(express.json());

// Define the path to the directory containing your static files
const staticPath = path.join(__dirname, '../../frontend/src/components/dashboard');

// Serve static files from the specified directory
app.use(express.static(staticPath));

// Routes
app.use("/", require("./routes/home"));
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/logout", require("./routes/logout"));

app.post('/stock', async (req, res) => {
    try {
        const symbol = req.query.stockSymbol;
        console.log('Fetching stock data for symbol:', symbol);
        const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
        const data = response.data;
        //console.log(data.chart.result[0].meta);

        // Extract relevant stock info from response
        const stockInfo = {
            symbol: data.chart.result[0].meta.symbol,
            currency: data.chart.result[0].meta.currency,
            currentPrice: data.chart.result[0].meta.regularMarketPrice,
            previousClose: data.chart.result[0].meta.previousClose,
            regularDayHigh: data.chart.result[0].meta.regularMarketDayHigh,
            regularDayLow: data.chart.result[0].meta.regularMarketDayLow,
            regularVolume: data.chart.result[0].meta.regularMarketVolume,
        };

        res.json(stockInfo);
        console.log('Sending stock data to frontend');
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})