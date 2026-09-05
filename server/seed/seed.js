require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');
const { categories, productsByCategory } = require('./data');

const importData = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Product.deleteMany();
  await Category.deleteMany();

  console.log('Seeding categories...');
  const createdCategories = await Category.insertMany(categories);
  const categoryMap = {};
  createdCategories.forEach((c) => (categoryMap[c.name] = c._id));

  console.log('Seeding products...');
  const productsToInsert = [];
  Object.entries(productsByCategory).forEach(([categoryName, products]) => {
    products.forEach((p) => {
      productsToInsert.push({ ...p, category: categoryMap[categoryName] });
    });
  });

  // insertMany skips pre('save') hooks, so create documents individually to get slugs generated
  for (const p of productsToInsert) {
    const doc = new Product(p);
    await doc.save();
  }

  console.log('Seeding admin & demo user...');
  const adminExists = await User.findOne({ email: 'admin@vimasho.com' });
  if (!adminExists) {
    await User.create({
      name: 'VIMASHO Admin',
      email: 'admin@vimasho.com',
      password: 'Admin@12345',
      role: 'admin',
    });
  }
  const demoExists = await User.findOne({ email: 'demo@vimasho.com' });
  if (!demoExists) {
    await User.create({
      name: 'Demo Customer',
      email: 'demo@vimasho.com',
      password: 'Demo@12345',
      role: 'customer',
    });
  }

  console.log('✅ Data imported successfully');
  console.log('   Admin login:  admin@vimasho.com / Admin@12345');
  console.log('   Demo login:   demo@vimasho.com / Demo@12345');
  process.exit();
};

const destroyData = async () => {
  await connectDB();
  await Product.deleteMany();
  await Category.deleteMany();
  await User.deleteMany({ role: { $ne: 'admin_keep' } });
  console.log('🗑️  Data destroyed');
  process.exit();
};

if (process.argv.includes('-d')) {
  destroyData();
} else {
  importData();
}
