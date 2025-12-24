import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { category, typeId } = req.query

  if ((!category || typeof category !== 'string') && !typeId) {
    return res.status(400).json({ message: 'Category parameter or typeId is required' })
  }

  try {
    let data: any = null
    let error: any = null

    if (typeId) {
      // If product type id is provided, call get_products(producttype_id)
      const id = Number(typeId)
      // RPC parameter name must match function signature (p_producttype_id)
      const resp = await supabase.rpc('get_products', { p_producttype_id: id })
      data = resp.data
      error = resp.error
    } else {
      // Fallback: call RPC by slug
      const resp = await supabase.rpc('get_products_by_category', {
        category_slug: category as string
      })
      data = resp.data
      error = resp.error
    }

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