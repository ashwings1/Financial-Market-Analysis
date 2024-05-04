const mongoose = require('mongoose');

const uri = 'mongodb+srv://ashwin12g:mongo@cluster3.yrumhwm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster3';

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB