const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected'));

const User = require('./models/User');

const createAdmin = async () => {
  const existing = await User.findOne({ email: 'sujaybjsujay943@gmail.com' });
  if (existing) {
    existing.role = 'admin';
    await existing.save({ validateBeforeSave: false });
    console.log('✅ Existing user promoted to admin!');
    process.exit(0);
  }

  const admin = await User.create({
    name: 'Sujay',
    email: 'sujaybjsujay943@gmail.com',
    password: 'Admin@123',
    role: 'admin',
    isVerified: true,
  });

  console.log('✅ Admin created!');
  console.log('📧 Email: sujaybjsujay943@gmail.com');
  console.log('🔑 Password: Admin@123');
  process.exit(0);
};

createAdmin().catch(err => {
  console.log('❌ Error:', err.message);
  process.exit(1);
});