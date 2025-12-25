import { NextApiRequest, NextApiResponse } from 'next'
import { Client } from 'pg'

let cachedPackaging: any[] | null = null
let cachedAt = 0
const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { typeId, all } = req.query

  try {
    // Serve cached data when available and fresh
    const now = Date.now()
    if (cachedPackaging && (now - cachedAt) < CACHE_TTL) {
      console.debug('Serving packaging from cache')
      if (all) return res.status(200).json({ packaging: cachedPackaging })
      if (typeId) return res.status(200).json({ packaging: cachedPackaging.filter(r => String(r.product_type_id) === String(typeId)) })
    }

    // Use Supabase RPC to fetch packaging (avoids direct DB host connection)
    const { data, error } = await supabase.rpc('get_product_packaging')
    if (error) throw error
    const rows = (data || []) as any[]

    // Cache full set
    cachedPackaging = rows
    cachedAt = now

    if (all) return res.status(200).json({ packaging: rows })
    if (typeId) {
      const filtered = rows.filter(r => String(r.product_type_id) === String(typeId))
      return res.status(200).json({ packaging: filtered })
    }

    return res.status(200).json({ packaging: rows })
  } catch (err) {
    console.error('Packaging API error:', err)
    return res.status(500).json({ message: 'Internal server error', error: err instanceof Error ? err.message : String(err) })
  }
}
