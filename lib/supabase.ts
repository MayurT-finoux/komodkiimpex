import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jgtsotoxfqbptrwtzkjc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndHNvdG94ZnFicHRyd3R6a2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTIyODEsImV4cCI6MjA4MTUyODI4MX0.3q9nqshcVNOOjNqp_3mqY6TFIKnM30xs17exD7W4SWE'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for your database
export interface ProductCategory {
  id: string
  name: string
  description?: string
  slug: string
  categories?: string[]
  bg_gradient?: string
  created_at?: string
  updated_at?: string
}

export interface Product {
  id: string
  name: string
  short_description: string
  category_id: string
  details: Record<string, any>
  created_at: string
  updated_at: string
}