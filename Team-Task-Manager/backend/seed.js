const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const seedData = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';
  
  console.log('🌱 Starting Database Seeding on:', mongoURI);
  
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB!');

    // Clear existing data
    console.log('🧹 Clearing old data...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('🧹 Old data successfully cleared.');

    // 1. Create users
    console.log('👥 Creating users...');
    const adminUser = new User({
      name: 'Demo Admin',
      email: 'admin@demo.com',
      password: 'password123',
      role: 'Admin'
    });
    
    const memberUser = new User({
      name: 'Demo Member',
      email: 'member@demo.com',
      password: 'password123',
      role: 'Member'
    });

    await adminUser.save();
    await memberUser.save();
    console.log('👥 Demo users registered successfully:');
    console.log(`   🔑 Admin  -> email: admin@demo.com  | password: password123`);
    console.log(`   🔑 Member -> email: member@demo.com | password: password123`);

    // 2. Create a project
    console.log('📂 Creating project...');
    const project = new Project({
      name: 'Website Redesign',
      description: 'Migrating legacy assets to a modern tech stack.',
      creator: adminUser._id,
      members: [adminUser._id, memberUser._id],
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    });

    await project.save();
    console.log(`📂 Project "${project.name}" created successfully.`);

    // 3. Create tasks
    console.log('📋 Creating tasks...');
    const task1 = new Task({
      title: 'Design Landing Page Layout',
      description: 'Mock up mobile-first dark-mode layouts.',
      project: project._id,
      assignee: memberUser._id,
      status: 'In Progress',
      priority: 'High',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    });

    const task2 = new Task({
      title: 'Verify Auth Router Middlewares',
      description: 'Verify login and signup access validations.',
      project: project._id,
      assignee: adminUser._id,
      status: 'Completed',
      priority: 'Medium',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    });

    await task1.save();
    await task2.save();
    console.log('📋 Tasks seeded successfully!');

    console.log('\n=========================================');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=========================================');
    
  } catch (error) {
    console.error('❌ Seeding Failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database.');
  }
};

seedData();
