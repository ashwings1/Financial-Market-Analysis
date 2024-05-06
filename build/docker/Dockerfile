# Official Node.js image as the base
FROM node:14

# Set the working directory for the backend
WORKDIR /usr/src/app/backend

# Copy the backend source code into the container
COPY ../../src/backend/src .

# Install backend dependencies
RUN npm install

# Set the working directory for the frontend
WORKDIR /usr/src/app/frontend

# Copy the frontend source code into the container
COPY ../../src/frontend .

# Install frontend dependencies and build the frontend code
RUN npm install
RUN npm run build

# Set the working directory for the Python scripts
WORKDIR /usr/src/app/scripts

# Copy the Python scripts into the container
COPY ../../src/scripts/data_processing.py .

# Install Python dependencies 
RUN pip install yfinance pandas

# Expose port 3000 (for the frontend)
EXPOSE 3000

# Set the working directory back to the backend
WORKDIR /usr/src/app/backend

# Command to run the backend server
CMD ["node", "src/server.js"]
