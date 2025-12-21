# Supabase API Integration Documentation

## Database Credentials

### Supabase Project Details
- **Host**: `db.jgtsotoxfqbptrwtzkjc.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`
- **User**: `postgres`
- **Password**: `Z3SVa2Bz43Dsmlhj`
- **Project URL**: `https://jgtsotoxfqbptrwtzkjc.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndHNvdG94ZnFicHRyd3R6a2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTIyODEsImV4cCI6MjA4MTUyODI4MX0.3q9nqshcVNOOjNqp_3mqY6TFIKnM30xs17exD7W4SWE`

## Database Function Details

### Original Function
- **Schema**: `komodkiimpex`
- **Function**: `get_product_types()`
- **Call**: `SELECT * FROM komodkiimpex.get_product_types();`
- **Returns**: Product category names with IDs

### Public Wrapper Function (Required for Supabase REST API)
```sql
CREATE OR REPLACE FUNCTION public.get_product_types()
RETURNS TABLE (
  id INT,
  name TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM komodkiimpex.get_product_types();
$$;

GRANT EXECUTE ON FUNCTION public.get_product_types() TO anon, authenticated;
```

## API Integration Methods

### Method 1: Supabase Client (Recommended)

#### Setup
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jgtsotoxfqbptrwtzkjc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndHNvdG94ZnFicHRyd3R6a2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTIyODEsImV4cCI6MjA4MTUyODI4MX0.3q9nqshcVNOOjNqp_3mqY6TFIKnM30xs17exD7W4SWE'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

#### Usage
```typescript
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase.rpc('get_product_types')
if (error) throw error
console.log(data) // Product types array
```

### Method 2: Direct PostgreSQL Connection

#### Setup
```bash
npm install pg @types/pg
```

#### Usage
```typescript
import { Client } from 'pg'

const client = new Client({
  host: 'db.jgtsotoxfqbptrwtzkjc.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Z3SVa2Bz43Dsmlhj',
  ssl: { rejectUnauthorized: false }
})

await client.connect()
const result = await client.query('SELECT * FROM komodkiimpex.get_product_types()')
await client.end()
console.log(result.rows) // Product types array
```

### Method 3: REST API Call

```typescript
const response = await fetch('https://jgtsotoxfqbptrwtzkjc.supabase.co/rest/v1/rpc/get_product_types', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndHNvdG94ZnFicHRyd3R6a2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTIyODEsImV4cCI6MjA4MTUyODI4MX0.3q9nqshcVNOOjNqp_3mqY6TFIKnM30xs17exD7W4SWE',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndHNvdG94ZnFicHRyd3R6a2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTIyODEsImV4cCI6MjA4MTUyODI4MX0.3q9nqshcVNOOjNqp_3mqY6TFIKnM30xs17exD7W4SWE'
  },
  body: JSON.stringify({})
})
const data = await response.json()
```

## Important Notes

1. **Schema Access**: Supabase REST API only exposes `public` schema by default
2. **Wrapper Functions**: Custom schema functions need public wrappers to be accessible via Supabase client
3. **Permissions**: Always grant execute permissions to `anon` and `authenticated` roles
4. **Security**: Use environment variables for sensitive credentials in production

## Environment Variables

```bash
# .env.local
DB_PASSWORD=Z3SVa2Bz43Dsmlhj
SUPABASE_URL=https://jgtsotoxfqbptrwtzkjc.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndHNvdG94ZnFicHRyd3R6a2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTIyODEsImV4cCI6MjA4MTUyODI4MX0.3q9nqshcVNOOjNqp_3mqY6TFIKnM30xs17exD7W4SWE
```

## Complete Next.js Example

```typescript
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProductTypes() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.rpc('get_product_types')
        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Product Types</h1>
      {products.map((product, index) => (
        <div key={index}>{JSON.stringify(product)}</div>
      ))}
    </div>
  )
}
```