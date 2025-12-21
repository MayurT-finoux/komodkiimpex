import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Test API called')
  return res.status(200).json({ message: 'API is working', timestamp: new Date().toISOString() })
}