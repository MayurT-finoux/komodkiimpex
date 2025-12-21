import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { STORAGE_BASE_URL } from '@/lib/config'
import { supabase } from '@/lib/supabase'
import { CheckCircle, Package, Box, Layers } from 'lucide-react'

export default function ProductDetailPage() {
  const router = useRouter()
  const { category, product } = router.query as { category?: string; product?: string }
  const [loading, setLoading] = useState(true)
  const [prod, setProd] = useState<any | null>(null)
  const [packaging, setPackaging] = useState<any | null>(null)

  useEffect(() => {
    if (!category || !product) return
    fetchProduct()
  }, [category, product])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${category}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed to fetch products')

      const items = (json.products || []).map((p: any) => ({
        ...p,
        slug: p.slug || (p.name ? String(p.name).toLowerCase().replace(/\s+/g, '-') : String(p.id || 'product'))
      }))

      const found = items.find((i: any) => i.slug === String(product))
      if (!found) {
        // fallback: try match by name
        const byName = items.find((i: any) => String(i.name).toLowerCase() === String(product).toLowerCase())
        if (byName) setProd(byName)
        else setProd(null)
      } else {
        setProd(found)
      }

      // Fetch packaging by product_type_id or category id
      const typeId = found?.category_id || found?.category || prod?.category_id || prod?.category || null
      if (typeId) await fetchPackagingByType(typeId)
    } catch (err) {
      console.error('Failed to load product:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPackagingByType = async (productTypeId: string | number) => {
    try {
      const { data, error } = await supabase.rpc('get_product_packaging')
      if (error) throw error
      const rows = (data || []).filter((r: any) => String(r.product_type_id) === String(productTypeId))
      if (!rows.length) return
      const grouped: any = { name: '', types: [] }
      grouped.name = rows[0].product_type
      rows.forEach((row: any) => {
        let specsObj: any = row.pkg_specs || {}
        if (typeof specsObj === 'string') {
          try { specsObj = JSON.parse(specsObj) } catch { try { specsObj = JSON.parse(specsObj.replace(/\r\n|\n/g, '')) } catch { specsObj = {} } }
        }
        const specs: string[] = []
        Object.keys(specsObj || {}).forEach((k) => {
          if (/^spec\d*/i.test(k)) specs.push(String(specsObj[k]).trim())
        })
        if (specs.length === 0) {
          Object.values(specsObj || {}).forEach((v) => { if (v) specs.push(String(v).trim()) })
        }
        grouped.types.push({ name: row.pkg_type, specs })
      })
      setPackaging(grouped)
    } catch (err) {
      console.warn('Packaging fetch failed:', err)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!prod) return <div className="min-h-screen flex items-center justify-center">Product not found</div>

  return (
    <>
      <Head>
        <title>{prod.name} - Komodki Impex</title>
      </Head>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-6xl mx-auto p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-2xl shadow p-6">
              <div className="flex gap-6">
                <div className="w-44 h-44 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {prod.image ? <img src={prod.image.startsWith('http') ? prod.image : `${STORAGE_BASE_URL}${prod.image}`} className="w-full h-full object-cover" /> : <div className="p-6 text-gray-500">No Image</div>}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{prod.name}</h1>
                  <p className="text-gray-600 mt-2">{prod.short_description || prod.short || ''}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Details</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(prod.details || {}).map(([k, v]) => (
                      <tr key={k}>
                        <td className="py-2 font-medium w-40 text-gray-700">{k}</td>
                        <td className="py-2 text-gray-700">{String(v)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold text-lg mb-4">Packaging</h3>
              {packaging ? (
                <div className="space-y-4">
                  {packaging.types.map((t: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded">
                      <h4 className="font-medium mb-2">{t.name}</h4>
                      <ul className="text-sm space-y-1">
                        {t.specs.map((s: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700"><CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5" />{s}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No packaging information available for this product.</p>
              )}
            </aside>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}