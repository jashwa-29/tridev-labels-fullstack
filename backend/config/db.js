const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    } catch (err) {
        console.error(`❌ Error: ${err.message}`.red);
        if (err.message.includes('auth') || err.message.includes('Authentication failed')) {
            console.error('👉 Tip: Check your MONGO_URI in Render Environment Variables. Ensure the password is correct and special characters are URL-encoded.'.yellow);
        }
        process.exit(1);
    }
};

module.exports = connectDB;
