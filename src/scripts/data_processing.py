import yfinance as yf
import pandas as pd 
import os

# Retrieves stock data using yfinance library and returns Pandas dataframe
def retrieve_stock(stock_symbol, start_date, end_date):
    try:
        stock_data = yf.download(stock_symbol, start = start_date, end = end_date)
        return stock_data
    except Exception as e:
        print("Error retrieving stock data: ", e)

# Saves data to a CSV file
def save_to_csv(retrieved_data, stock_name, folder_path):
    try:
        file_name = os.path.join(folder_path, f"{stock_name}_stock_data.csv")
        retrieved_data.to_csv(file_name)
        print("Data saved to: ", file_name)
    except Exception as e:
        print("Error saving to CSV: ", e)


if __name__ == '__main__':
    stock_symbol = "AAPL"
    start_date = "2023-01-01"
    end_date = "2024-05-01"
    folder_path = "stockData"

    #If folder does not exist, create it 
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    stock_data = retrieve_stock(stock_symbol, start_date, end_date)
    if stock_data is not None:
        save_to_csv(stock_data, stock_symbol, folder_path)
