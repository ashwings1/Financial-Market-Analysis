const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require('./config/dbConnection');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Built-in middleware to handle url encoded form data
app.use(express.urlencoded({ extended: false }));

// Built-in middleware for json
app.use(express.json());

//Routes
app.use("/", require("./routes/home"));
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/logout", require("./routes/logout"));

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})