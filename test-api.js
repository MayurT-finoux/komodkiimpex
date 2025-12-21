// Test script to check API
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jgtsotoxfqbptrwtzkjc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndHNvdG94ZnFicHRyd3R6a2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTIyODEsImV4cCI6MjA4MTUyODI4MX0.3q9nqshcVNOOjNqp_3mqY6TFIKnM30xs17exD7W4SWE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAPI() {
  try {
    console.log('Testing Supabase connection...')
    const { data, error } = await supabase.rpc('get_product_types')
    
    if (error) {
      console.error('Supabase error:', error)
    } else {
      console.log('Success! Data:', data)
    }
  } catch (err) {
    console.error('Connection error:', err)
  }
}

testAPI()