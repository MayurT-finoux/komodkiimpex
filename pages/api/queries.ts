import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, email, company, country, postalCode, message } = req.body || {}

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields: name, email, message' })
  }

  try {
    // mobile number intentionally null as requested
    const mobileno = null

    // Call Supabase RPC to create user query — use exact parameter names
    const { data, error } = await supabase.rpc('create_user_query', {
      p_name: name,
      p_email: email,
      p_mobile: mobileno,
      p_companyname: company || null,
      p_country: country || null,
      p_postalcode: postalCode || null,
      p_message: message
    })

    if (error) {
      console.error('Supabase RPC Error:', error)
      return res.status(500).json({ message: 'RPC failed', error })
    }

    console.log('create_user_query result:', data)
    return res.status(200).json({ message: 'Query saved', data })
  } catch (err) {
    console.error('API error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
