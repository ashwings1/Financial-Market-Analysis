require('dotenv').config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require('./config/dbConnection');
const axios = require("axios");
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3500;
const DB_URI = process.env.DATABASE_URI;
const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY;


// Connect to MongoDB
connectDB();

app.use(cors());

// Built-in middleware to handle url encoded form data
app.use(express.urlencoded({ extended: true }));

// Built-in middleware for json
app.use(express.json());

// Path to the directory containing static files
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

        io.emit('stockData', stockInfo);
        res.json(stockInfo);
        //console.log('Sending stock data to frontend');
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

app.post('/news', async (req, res) => {
    try {
        const symbol = req.query.stockSymbol;
        console.log('Fetching news for symbol: ', symbol);
        const response = await axios.get(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`);
        const data = response.data;
        console.log(data);
        const news = data.news;
        console.log(news);

        io.emit('newsData', news);
        console.log('Sending news data to frontend');
        res.json({ news });
    } catch (error) {
        console.error('Error fetching news data:', error);
        res.status(500).json({ error: 'Failed to fetch news data' });
    }
});

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})