import { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userId, query, response, timestamp } = req.body

      // Validate required fields
      if (!userId || !query || !response) {
        return res.status(400).json({ 
          message: 'Missing required fields',
          received: { userId, query, response }
        })
      }

      const connection = await mysql.createConnection(dbConfig)

      await connection.execute(
        'INSERT INTO chat_history (user_id, query, response, timestamp) VALUES (?, ?, ?, ?)',
        [userId, query, response, timestamp]
      )

      await connection.end()

      res.status(200).json({ message: 'Chat history saved' })
    } catch (error) {
      console.error('Database error:', error)
      // Send more detailed error information
      res.status(500).json({ 
        message: 'Failed to save chat history',
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }
  
  if (req.method === 'GET') {
    try {
      const { userId } = req.query
      
      const connection = await mysql.createConnection(dbConfig)
      
      const [rows] = await connection.execute(
        'SELECT * FROM chat_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50',
        [userId]
      )
      
      await connection.end()
      
      res.status(200).json(rows)
    } catch (error) {
      console.error('Database error:', error)
      res.status(500).json({ message: 'Failed to load chat history' })
    }
  }
} 