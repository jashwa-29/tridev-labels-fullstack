const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('../models/User');
const connectDB = require('../config/db');

// Load env vars
dotenv.config(); // Looks for .env in current directory

const manageAdmins = async () => {
  try {
    await connectDB();

    const args = process.argv.slice(2);
    const command = args[0];
    const email = args[1];

    if (command === '--list') {
      const users = await User.find({}, 'name email role');
      console.log('Registered Users:'.cyan.bold);
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email}) [${user.role}]`);
      });
    } else if (command === '--promote') {
      if (!email) {
        console.log('Please provide an email: node manage_admins.js --promote <email>'.red);
        process.exit(1);
      }

      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found'.red);
        process.exit(1);
      }

      user.role = 'superadmin';
      await user.save();
      console.log(`User ${user.email} promoted to Super Admin`.green.bold);
    } else {
      console.log('Usage:'.yellow);
      console.log('  node manage_admins.js --list'.white);
      console.log('  node manage_admins.js --promote <email>'.white);
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

manageAdmins();
