import { connectToDatabase } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      let results = [];
      let source = 'demo';
      
      if (db) {
        results = await db.collection('submissions')
          .find({})
          .sort({ score: -1, timestamp: 1 })
          .project({
            teamName: 1,
            teamNo: 1,
            score: 1,
            totalWords: 1,
            percentage: 1,
            timestamp: 1,
            timeSpent: 1
          })
          .toArray();
        source = 'mongodb';
      }
      
      return res.json({ 
        success: true, 
        results: results,
        count: results.length,
        source: source,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Results error:', error);
      return res.json({ 
        success: true, 
        results: [],
        message: 'Using demo data',
        error: error.message 
      });
    }
  }
  
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}