const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Set a timeout to prevent long hangs if MongoDB is unavailable
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.isDemoMode = false;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Failed: ${error.message}`);
    console.warn(`🚀 Falling back to In-Memory Demo Mode! (Zero Setup Required)`);
    global.isDemoMode = true;
    
    // Initialize mock database tables
    global.mockUsers = [
      {
        _id: 'mock-user-admin',
        name: 'Demo Admin',
        email: 'admin@demo.com',
        role: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'mock-user-member',
        name: 'Demo Member',
        email: 'member@demo.com',
        role: 'Member',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    global.mockProjects = [
      {
        _id: 'mock-proj-1',
        name: 'Website Redesign',
        description: 'Migrating legacy assets to a modern tech stack.',
        creator: { _id: 'mock-user-admin', name: 'Demo Admin' },
        members: ['mock-user-admin', 'mock-user-member'],
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    global.mockTasks = [
      {
        _id: 'mock-task-1',
        title: 'Design Landing Page Layout',
        description: 'Mock up mobile-first dark-mode layouts.',
        project: 'mock-proj-1',
        assignee: { _id: 'mock-user-member', name: 'Demo Member', email: 'member@demo.com' },
        status: 'In Progress',
        priority: 'High',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'mock-task-2',
        title: 'Verify Auth Router Middlewares',
        description: 'Verify login and signup access validations.',
        project: 'mock-proj-1',
        assignee: { _id: 'mock-user-admin', name: 'Demo Admin', email: 'admin@demo.com' },
        status: 'Completed',
        priority: 'Medium',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
};

module.exports = connectDB;
