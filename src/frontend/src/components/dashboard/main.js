
console.log("before eventListener");
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const stockInfoContainer = document.getElementById('stockInfo');
    const newsInfoContainer = document.getElementById('newsInfo');
    //console.log("after eventListener");

    // Connect to Socket.IO server
    const socket = io({
        reconnection: false
    });

    // Listen for stockData event from server
    socket.on('stockData', (stockData) => {
        console.log("Received stock data: ", stockData);
        displayStockInfo(stockData);
    });

    // Listen for newsData event from server
    socket.on('newsData', (newsData) => {
        console.log("Received news data: ", newsData);
        displayNews(newsData);
    });

    // Function to fetch stock data from the server
    const fetchStockData = async (symbol) => {
        try {
            // POST request to fetch stock data from backend
            const response = await fetch(`/stock?stockSymbol=${symbol}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ symbol })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch stock data from backend');
            }

            const data = await response.json();
            displayStockInfo(data);
        } catch (error) {
            console.error('Error fetching stock data:', error);
            stockInfoContainer.innerHTML = '<p>Error fetching stock data</p>';
            return null;
        }
    };

    const fetchNewsData = async (symbol) => {
        try {
            const newsResponse = await fetch(`/news?stockSymbol=${symbol}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ symbol })
            });

            if (!newsResponse.ok) {
                throw new Error('Failed to fetch news data from backend');
            }

            const newsData = await newsResponse.json();
            displayNews(newsData);
        } catch (error) {
            console.log('Error fetching news data:', symbol);
            newsInfoContainer.innerHTML = '<p>Error fetching news data</p>';
        }
    };

    // Function to start automatic updates
    let updateInterval;

    const startAutomaticUpdates = (symbol) => {
        updateInterval = setInterval(() => {
            fetchStockData(symbol);
            //fetchNewsData(symbol);
        }, 5000); // Fetch updated data every 5 seconds (adjust the interval as needed)
    };

    // Function to stop automatic updates
    const stopAutomaticUpdates = () => {
        clearInterval(updateInterval);
    };

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const formData = new FormData(searchForm);
        const symbol = formData.get('stockSymbol');

        // Stop previous automatic updates
        stopAutomaticUpdates();

        // Start automatic updates with the new stock symbol
        startAutomaticUpdates(symbol);

        // Fetch initial stock data
        await fetchStockData(symbol);

        // Fetch initial news data
        await fetchNewsData(symbol);
    });

    function displayStockInfo(stockData) {
        stockInfoContainer.innerHTML = `
            <h2>${stockData.symbol} - ${stockData.currency}</h2>
            <p>Current Price: $${stockData.currentPrice}</p>
            <p>Previous Close: $${stockData.previousClose}</p>
            <p>Regular Day High: $${stockData.regularDayHigh}</p>
            <p>Regular Day Low: $${stockData.regularDayLow}</p>
            <p>Regular Day Volume: ${stockData.regularVolume}</p>
        `;
    }

    function displayNews(newsData) {
        if (newsData) {
            // Clear previous news
            newsInfoContainer.innerHTML = '';

            // Display news articles
            newsData.forEach(article => {
                const newsItem = document.createElement('div');
                newsItem.classList.add('news-item');
                newsItem.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.description}</p>
            `;
                newsInfoContainer.appendChild(newsItem);
            });
        } else {
            console.error('News data is null or undefined');
        }

    }
});
