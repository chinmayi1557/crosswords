import { connectToDatabase } from './db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  try {
    const { teamName, teamNo, score, totalWords, percentage, answers, timeSpent } = req.body;
    
    if (!teamName || !teamNo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Team Name and Team Number are required' 
      });
    }
    
    const { db } = await connectToDatabase();
    let savedToDB = false;
    
    if (db) {
      // Save to MongoDB if connected
      const submission = {
        teamName: teamName.trim(),
        teamNo: teamNo.trim(),
        score: parseInt(score) || 0,
        totalWords: parseInt(totalWords) || 0,
        percentage: parseFloat(percentage) || 0,
        answers: answers || {},
        timeSpent: timeSpent || '00:00',
        timestamp: new Date(),
        source: 'mongodb'
      };
      
      await db.collection('submissions').insertOne(submission);
      savedToDB = true;
    }
    
    return res.status(200).json({ 
      success: true, 
      message: savedToDB ? 'Saved to database!' : 'Saved locally (demo mode)',
      teamName: teamName,
      score: score,
      totalWords: totalWords,
      percentage: percentage,
      timestamp: new Date().toISOString(),
      savedToDatabase: savedToDB
    });
    
  } catch (error) {
    console.error('Submit error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
}