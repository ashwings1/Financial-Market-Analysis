# Financial Market Analysis Project
This application uses Azure AutoML to forecast stock prices. 

The backend is written in Node.js, Express.js framework, and MongoDB for storing user details when registering.

Python is used for retrieving the stock data from yFinance and processing the data to a CSV which Azure AutoML will use.

A REST API layer is used to access the Azure AutoML endpoint to receive the predictions.

HTML/CSS was used with JavaScript for the web page templates. 

The application is containerized using Docker and Kubernetes for fault tolerance and scalability. 

## Functionality

### Real-time Stock Data Retrieval
The application fetches real-time stock data from Yahoo Finance API based on user input.

It displays various stock metrics including current price, open price, high, low, volume, etc.

Socket.IO is used for real-time updates, ensuring that users receive the latest stock data as it becomes available.

### News Sentiment Analysis
The application retrieves news articles related to the selected stock symbol.

It analyzes the sentiment of news articles using the Alpha Vantage API.

News articles are categorized based on sentiment labels (positive, negative, neutral) and displayed accordingly.

### Integration with Azure AutoML
The project integrates with Azure AutoML for stock price forecasting.

It sends historical stock data to an Azure AutoML endpoint and receives forecasted stock prices in response.

The forecasted prices are displayed to users in real-time. 

### Frontend Display
The frontend provides a user-friendly interface for interacting with the application.

Users can input stock symbols, view real-time stock data, and read sentiment-analyzed news articles.

The UI is responsive and updates dynamically as data is received from the backend APIs.

### Continuous Updates
The application continuously fetches and updates stock data and news articles at regular intervals.

Error handling mechanisms are in place to ensure smooth operation even in case of API failures or network issues.






