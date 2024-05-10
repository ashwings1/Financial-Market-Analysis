const mongoose = require('mongoose');

const uri = process.env.DATABASE_URI;
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