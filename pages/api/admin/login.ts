import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { username, password } = req.body || {}
  if (!username || !password) return res.status(400).json({ message: 'username and password required' })

  try {
    // Prefer komodkiimpex.admin_login via RPC (server-side call through Supabase REST)
    const { data, error } = await supabase.rpc('admin_login', { p_username: username, p_password: password } as any)
    console.debug('supabase rpc admin_login:', { data, error })
    if (error) throw error

    const rows = (data || []) as any[]
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' })

    const row = rows[0]
    return res.status(200).json({ admin: row })
  } catch (err) {
    console.error('admin login error:', err)
    return res.status(500).json({ message: 'Internal server error', error: err instanceof Error ? err.message : String(err) })
  }
}