const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./models/Service');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI;

const exportData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const services = await Service.find({}).lean();
        fs.writeFileSync(path.join(__dirname, 'services_dump.json'), JSON.stringify(services, null, 2));
        console.log('Data exported to services_dump.json');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

exportData();
