import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { STORAGE_BASE_URL } from '@/lib/config'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })

  try {
    const { data, error } = await supabase.rpc('get_active_homepage_data')
    if (error) throw error
    const rows = (data || []) as any[]
    if (!rows.length) return res.status(404).json({ message: 'No homepage data found' })

    const row = rows[0]

    // homeimages may come as JSON or text
    let homeObj: any = row.homeimages || {}
    if (typeof homeObj === 'string') {
      try { homeObj = JSON.parse(homeObj) } catch { homeObj = {} }
    }

    const values = Object.keys(homeObj).sort().map(k => homeObj[k]).filter(Boolean)

    const images = values.slice(0, 5).map((v: string) => {
      if (!v) return null
      if (/^https?:\/\//i.test(v)) return v
      return `${STORAGE_BASE_URL}${v}`
    }).filter(Boolean)

    // About image
    let aboutImg = row.aboutimage || null
    if (aboutImg && typeof aboutImg === 'string') {
      if (!/^https?:\/\//i.test(aboutImg)) aboutImg = `${STORAGE_BASE_URL}${aboutImg}`
    } else {
      aboutImg = null
    }

    return res.status(200).json({ images, aboutImage: aboutImg, raw: row })
  } catch (err) {
    console.error('Homepage API error:', err)
    return res.status(500).json({ message: 'Internal server error', error: err instanceof Error ? err.message : String(err) })
  }
}