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

/*
// Azure AutoML config
const SUBSCRIPTION_ID = process.env.AZURE_SUBSCRIPTION_ID;
const RESOURCE_GROUP = process.env.AZURE_RESOURCE_GROUP;
const WORKSPACE_NAME = process.env.AZURE_WORKSPACE_NAME;
const MODEL_NAME = procces.env.AZURE_MODEL_NAME;
const AZURE_CLIENT_ID = process.env.AZURE_CLIENT_ID;
const AZURE_TENANT_ID = process.env.AZURE_TENANT_ID;
const AZURE_CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
*/

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
        //console.log('Fetching stock data for symbol:', symbol);
        const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?includePrePost=true&interval=1d`);
        const data = response.data;

        //console.log("stock data:", data.chart.result[0]);
        //console.log("stock data:", data.chart.result[0].indicators.quote[0]);

        const currDateTime = new Date();

        // Format date
        const formattedDate = currDateTime.toISOString().slice(0, 10); // Format date as "YYYY-MM-DD"

        // Format time
        const hours = String(currDateTime.getHours()).padStart(2, '0'); // Get hours and pad with leading zero if necessary
        const minutes = String(currDateTime.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero if necessary
        const seconds = String(currDateTime.getSeconds()).padStart(2, '0'); // Get seconds and pad with leading zero if necessary
        const time = `${hours}:${minutes}:${seconds}`; // Combine hours, minutes, and seconds

        // Combine date and time
        const formattedDateTime = `${formattedDate} ${time}`;

        console.log("formattedDateTime", formattedDateTime);

        const dateDay = currDateTime.toLocaleDateString();
        const dateTime = currDateTime.toLocaleTimeString();


        // Extract relevant stock info from response
        const stockInfo = {
            symbol: data.chart.result[0].meta.symbol,
            currency: data.chart.result[0].meta.currency,
            currentDate: dateDay,
            currentTime: dateTime,
            currentPrice: parseFloat(data.chart.result[0].meta.regularMarketPrice).toFixed(2),
            todayOpen: parseFloat(data.chart.result[0].indicators.quote[0].open[0]).toFixed(2),
            previousClose: parseFloat(data.chart.result[0].meta.previousClose).toFixed(2),
            adjustedPreviousClose: parseFloat(data.chart.result[0].indicators.adjclose[0].adjclose[0]).toFixed(2),
            dayHigh: parseFloat(data.chart.result[0].meta.regularMarketDayHigh).toFixed(2),
            dayLow: parseFloat(data.chart.result[0].meta.regularMarketDayLow).toFixed(2),
            dayVolume: data.chart.result[0].meta.regularMarketVolume.toLocaleString(),
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

        // Extract relevant stock info from response
        // Extract relevant stock info from response
        if (data && data.feed) {
            const news = data.feed.map(item => {
                // Parse time_published string into a Date object
                const timePublishedString = item.time_published || "";
                const year = timePublishedString.slice(0, 4);
                const month = timePublishedString.slice(4, 6);
                const day = timePublishedString.slice(6, 8);
                const hours = timePublishedString.slice(9, 11);
                const minutes = timePublishedString.slice(11, 13);
                const seconds = timePublishedString.slice(13, 15);
                const timePublished = new Date(year, month - 1, day, hours, minutes, seconds);

                // Format the date as desired (for example, in a readable string)
                const formattedTimePublished = timePublished.toLocaleString();

                // Return the formatted time_published along with other fields
                return {
                    title: item.title || "",
                    url: item.url || "",
                    time_published: formattedTimePublished,
                    authors: item.authors || [],
                    summary: item.summary || "",
                    banner_image: item.banner_image || "",
                    source: item.source || "",
                    category_within_source: item.category_within_source || "",
                    source_domain: item.source_domain || "",
                    topics: item.topics || [],
                    overall_sentiment_score: item.overall_sentiment_score || 0,
                    overall_sentiment_label: item.overall_sentiment_label || "",
                    ticker_sentiment: item.ticker_sentiment || []
                };
            });

            console.log('Sending news data to frontend:');
            res.json({ news });
        } else {
            console.error('Invalid response format from Alpha Vantage API');
            res.status(500).json({ error: 'Failed to fetch news data' });
        }
    } catch (error) {
        console.error('Error fetching news data:', error);
        res.status(500).json({ error: 'Failed to fetch news data' });
    }
});

app.post('/forecast', async (req, res) => {
    try {
        const symbol = req.query.stockSymbol;
        const forecastHorizion = req.query.forecastHorizon || 7;

        // Fetch stock data for given symbol
        const response = await axios.post('http://localhost:3500/stock', { stockSymbol: symbol });
        const stockInfo = response.data;

        // Prepare data for forecasting with retrieved stock info
        const timeSeriesData = prepareTimeSeriesData(stockInfo);

        // Call Azure AutoML to get forecast
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        res.status(500).json({ error: 'Failed to fetch forecast data' });
    }
});

function prepareTimeSeriesData(stockInfo) {
    const { currentDate, currentPrice, todayOpen, adjustedPreviousClose, dayHigh, dayLow, dayVolume } = stockInfo;

    const input_data = {
        data: [{
            Date: currentDate,
            Open: todayOpen,
            High: dayHigh,
            Low: dayLow,
            "Adj Close": adjustedPreviousClose,
            Volume: dayVolume
        }]
    };

    return { input_data, GlobalParameters: 0.0 };
}


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