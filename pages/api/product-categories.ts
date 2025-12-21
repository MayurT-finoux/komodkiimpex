import { NextApiRequest, NextApiResponse } from 'next'
import { Client } from 'pg'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const client = new Client({
    host: 'db.jgtsotoxfqbptrwtzkjc.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Z3SVa2Bz43Dsmlhj',
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('Connecting to PostgreSQL...')
    await client.connect()
    
    console.log('Calling SELECT * FROM public.get_product_types()...')
    const result = await client.query('SELECT * FROM public.get_product_types()')
    
    console.log('Database response:', result.rows)
    
    // Transform database data - map product_type to name
    const gradients = [
      'from-blue-600 to-purple-600',
      'from-orange-600 to-red-600', 
      'from-teal-600 to-green-600',
      'from-purple-600 to-pink-600',
      'from-green-600 to-blue-600'
    ]

    const categories = result.rows.map((item: any, index: number) => ({
      id: item.id,
      name: item.product_type,
      slug: item.product_type.toLowerCase().replace(/\s+/g, '-'),
      description: `High-quality ${item.product_type} products for export`,
      categories: [],
      bg_gradient: gradients[index % gradients.length]
    }))

    console.log('Returning categories:', categories)
    return res.status(200).json({ categories })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  } finally {
    await client.end()
  }
}