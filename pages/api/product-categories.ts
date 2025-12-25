import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { data, error } = await supabase.rpc('get_product_types')
    if (error) throw error

    const rows = (data || []) as any[]

    const gradients = [
      'from-blue-600 to-purple-600',
      'from-orange-600 to-red-600', 
      'from-teal-600 to-green-600',
      'from-purple-600 to-pink-600',
      'from-green-600 to-blue-600'
    ]

    const categories = rows.map((item: any, index: number) => ({
      id: item.id,
      name: item.product_type,
      slug: item.product_type.toLowerCase().replace(/\s+/g, '-'),
      description: item.product_desc || `High-quality ${item.product_type} products for export`,
      categories: Array.isArray(item.product_tags) ? item.product_tags : (item.product_tags ? String(item.product_tags).split(',').map((t: string) => t.trim()) : []),
      bg_gradient: gradients[index % gradients.length],
      product_type_img: item.product_type_img || null
    }))

    return res.status(200).json({ categories })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}