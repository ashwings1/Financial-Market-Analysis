console.log("before eventListener");
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const stockInfoContainer = document.getElementById('stockInfo');
    //console.log("after eventListener");
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        //console.log("inside searchForm");
        const formData = new FormData(searchForm);
        const symbol = formData.get('stockSymbol');

        try {
            console.log("inside symbol");

            // POST request to send stock symbol to backend
            const response = await fetch(`/stock?stockSymbol=${symbol}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ symbol })
            });

            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to send stock symbol to backend');
            }

            console.log("received data");
            const data = await response.json();
            displayStockInfo(data);
        } catch (error) {
            console.error('Error fetching stock data:', error);
            stockInfoContainer.innerHTML = '<p>Error fetching stock data</p>';
        }
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
});


