import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { category } = req.query

  if (!category || typeof category !== 'string') {
    return res.status(400).json({ message: 'Category parameter is required' })
  }

  try {
    // Call your Supabase function to get products by category
    const { data, error } = await supabase.rpc('get_products_by_category', {
      category_slug: category
    })
    
    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ message: 'Database error', error: error.message })
    }

    return res.status(200).json({ products: data })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}