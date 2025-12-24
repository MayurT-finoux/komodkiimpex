import { NextApiRequest, NextApiResponse } from 'next'
import { Client } from 'pg'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { typeId } = req.query
  if (!typeId) return res.status(400).json({ message: 'typeId is required' })

  const client = new Client({
    host: 'db.jgtsotoxfqbptrwtzkjc.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Z3SVa2Bz43Dsmlhj',
    ssl: { rejectUnauthorized: false }
  })

  try {
    await client.connect()
    const q = 'SELECT * FROM public.get_product_packaging() WHERE product_type_id = $1'
    const result = await client.query(q, [Number(typeId)])
    return res.status(200).json({ packaging: result.rows })
  } catch (err) {
    console.error('Packaging API error:', err)
    return res.status(500).json({ message: 'Internal server error', error: err instanceof Error ? err.message : String(err) })
  } finally {
    await client.end()
  }
}
