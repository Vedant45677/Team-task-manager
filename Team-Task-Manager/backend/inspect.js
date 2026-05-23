const mongoose = require('mongoose');
require('dotenv').config();

const inspectDatabase = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';
  
  console.log('🔍 Connecting to MongoDB: ', mongoURI);
  
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected successfully!');
    
    const db = mongoose.connection.db;
    
    // List all collections in the database
    const collections = await db.listCollections().toArray();
    console.log('\n==================================================');
    console.log(`📂 Collections in database "${db.databaseName}":`);
    console.log('==================================================');
    
    if (collections.length === 0) {
      console.log('⚠️ No collections found yet! Go to http://localhost:5173/ and register/login to create data.');
    } else {
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`📌 Collection: "${col.name}" | Total Documents: ${count}`);
        
        // Print a few sample documents if they exist
        if (count > 0) {
          const samples = await db.collection(col.name).find().limit(3).toArray();
          console.log('--- Sample Documents ---');
          console.log(JSON.stringify(samples, null, 2));
          console.log('------------------------\n');
        } else {
          console.log('   (Empty collection)\n');
        }
      }
    }
  } catch (error) {
    console.error('❌ Connection Failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database.');
  }
};

inspectDatabase();
