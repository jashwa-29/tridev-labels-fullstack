// seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const adminEmail = 'jashwa4673@gmail.com';
  const adminPassword = 'admin123';

  const adminExists = await User.findOne({ email: adminEmail });
  if (adminExists) {
    console.log('✅ Admin already exists');
    console.log(`👉 Email: ${adminEmail}`);
    console.log(`👉 Password: ${adminPassword}`);
    return process.exit();
  }

  const admin = new User({
    name: 'Admin',
    email: adminEmail,
    password: adminPassword, // Will be hashed by model
    role: 'admin'
  });

  await admin.save();

  console.log('✅ Admin created successfully!');
  console.log('🔐 Login credentials:');
  console.log(`👉 Email: ${adminEmail}`);
  console.log(`👉 Password: ${adminPassword}`);
  process.exit();
};

seedAdmin();
