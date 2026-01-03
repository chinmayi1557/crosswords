import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.log('⚠️ MONGODB_URI not set - running in demo mode');
    return { client: null, db: null };
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db('crossword_db');
    console.log('✅ Connected to MongoDB');
    
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return { client: null, db: null };
  }
}