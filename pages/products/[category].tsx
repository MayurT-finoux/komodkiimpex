import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ChevronDown, ChevronUp, CheckCircle, Package, Box, Layers } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Product } from '@/lib/supabase'
import { STORAGE_BASE_URL } from '@/lib/config'

type Props = { 
  category: string 
  categoryName: string
}

export default function ProductCategoryPage({ category, categoryName }: Props) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryImage, setCategoryImage] = useState<string | undefined>(undefined)
  const [categoryDesc, setCategoryDesc] = useState<string | undefined>(undefined)

  useEffect(() => {
    fetchProducts()
    fetchCategoryMeta()
  }, [category])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products/${category}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products')
      }

      // Normalize product images (check multiple possible fields)
      const mapped = (data.products || []).map((p: any) => {
        const possible = [
          p.product_img,
          p.image,
          p.product_image,
          p.img,
          p.details?.image,
          Array.isArray(p.details?.images) && p.details.images[0]
        ].filter(Boolean)

        let imgValue = possible.length ? possible[0] : undefined
        if (typeof imgValue === 'string' && imgValue && !/^https?:\/\//i.test(imgValue)) {
          imgValue = `${STORAGE_BASE_URL}${imgValue}`
        }

        return { ...p, image: imgValue }
      })

      setProducts(mapped)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err instanceof Error ? err.message : 'Failed to load products')
      // Fallback to static data
      const fallbackCatalog: Record<string, any[]> = {
        'minerals': [
          {
            name: 'Iron Ore - Grade A',
            short_description: 'Premium iron ore with consistent composition for metallurgy.',
            details: { Origin: 'Indonesia', Purity: '62% Fe', Packaging: 'Bulk Bags / Containers', MOQ: '20 MT' },
          },
          {
            name: 'Copper Concentrate',
            short_description: 'High grade copper concentrate suitable for smelting.',
            details: { Origin: 'Chile', Concentrate: '25% Cu', Packaging: 'Containers', MOQ: '10 MT' },
          },
        ],
        'hardware': [
          {
            name: 'High Torque Wrench Set',
            short_description: 'Durable professional-grade wrenches for industrial use.',
            details: { Material: 'Chrome Vanadium', Pieces: '10', Warranty: '2 years' },
          },
          {
            name: 'Industrial Fasteners Pack',
            short_description: 'Assorted fasteners for large-scale assembly lines.',
            details: { Material: 'Stainless Steel', Sizes: 'M4-M20', Packaging: 'Cartons' },
          },
        ],
        'petroleum-jelly': [
          {
            name: 'Cosmetic Grade Jelly 1kg',
            short_description: 'White, odorless petroleum jelly for cosmetic formulations.',
            details: { Grade: 'Cosmetic', NetWeight: '1kg', ShelfLife: '3 years' },
          },
          {
            name: 'Industrial Petroleum Jelly 25kg',
            short_description: 'Industrial grade for lubricants and manufacturing.',
            details: { Grade: 'Industrial', NetWeight: '25kg', Packaging: 'Drums' },
          },
        ],
      }
      const fallback = (fallbackCatalog[category] || []).map((p: any) => ({ ...p, image: undefined }))
      setProducts(fallback)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategoryMeta = async () => {
    try {
      const res = await fetch('/api/product-categories')
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed to fetch categories')
      const found = (json.categories || []).find((c: any) => c.slug === category)
      if (found) {
        setCategoryDesc(found.description)
        if (found.product_type_img) {
          const val = String(found.product_type_img)
          setCategoryImage(/^https?:\/\//i.test(val) ? val : `${STORAGE_BASE_URL}${val}`)
        }
        // Fetch packaging for this category by ID
        fetchPackagingForCategory(found.id)
      }
    } catch (err) {
      // not critical
      console.warn('Category meta fetch failed:', err)
    }
  }

  const [packagingData, setPackagingData] = useState<any | null>(null)

  const fetchPackagingForCategory = async (productTypeId: string) => {
    try {
      const { data, error } = await (await import('@/lib/supabase')).supabase.rpc('get_product_packaging')
      if (error) throw error
      const rows = (data || []).filter((r: any) => String(r.product_type_id) === String(productTypeId))
      if (rows.length === 0) return
      const grouped: Record<string, any> = { types: [] }
      rows.forEach((row: any) => {
        const specsObj = row.pkg_specs || {}
        const specs = [specsObj.spec1, specsObj.spec2, specsObj.spec3].filter(Boolean)
        grouped.types.push({ name: row.pkg_type, specs })
      })

      // Choose gradient by category name fallback
      const gradientMap: Record<string, string> = { 'minerals': 'from-blue-600 to-purple-600', 'hardware': 'from-orange-600 to-red-600', 'petroleum-jelly': 'from-teal-600 to-green-600' }
      const iconMap: Record<string, any> = { 'minerals': Package, 'hardware': Box, 'petroleum-jelly': Layers }
      const pkg = {
        name: categoryName,
        gradient: gradientMap[category] || 'from-blue-600 to-purple-600',
        icon: iconMap[category] || Package,
        types: grouped.types
      }

      setPackagingData(pkg)
    } catch (err) {
      console.warn('Failed to fetch packaging for category:', err)
    }
  }



  // Map categories to packaging data
  const packagingMap: Record<string, { name: string; gradient: string; icon: any; types: any[] }> = {
    'minerals': {
      name: 'Minerals',
      gradient: 'from-blue-600 to-purple-600',
      icon: Package,
      types: [
        { name: 'Bulk Bags', specs: ['500kg-2000kg capacity', 'UV resistant', 'Moisture proof liner'] },
        { name: 'Drums', specs: ['50kg-200kg capacity', 'Air-tight sealing', 'Stackable design'] },
        { name: 'Containers', specs: ['20ft & 40ft options', 'Climate controlled', 'Secure loading'] },
      ],
    },
    'hardware': {
      name: 'Hardware',
      gradient: 'from-orange-600 to-red-600',
      icon: Box,
      types: [
        { name: 'Carton Boxes', specs: ['Multi-layer protection', 'Custom sizes available', 'Water resistant'] },
        { name: 'Wooden Crates', specs: ['ISPM 15 certified', 'Load: up to 1000kg', 'Fumigation treated'] },
        { name: 'Pallet Packaging', specs: ['Standard & Euro pallets', 'Strapping & protection', 'Forklift compatible'] },
      ],
    },
    'petroleum-jelly': {
      name: 'Petroleum Jelly',
      gradient: 'from-teal-600 to-green-600',
      icon: Layers,
      types: [
        { name: 'Plastic Containers', specs: ['50g-5kg sizes', 'Tamper-proof seals', 'FDA approved material'] },
        { name: 'Metal Tins', specs: ['100g-1kg capacity', 'Air-tight closure', 'Recyclable material'] },
        { name: 'Bulk Drums', specs: ['25kg-200kg capacity', 'Food-safe lining', 'Easy dispensing'] },
      ],
    },
  }

  const packaging = packagingData || packagingMap[category]

  return (
    <>
      <Head>
        <title>{categoryName} - Komodki Impex</title>
        <meta name="description" content={`Browse our ${categoryName.toLowerCase()} products. Quality export solutions from Komodki Impex.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <section className="bg-white min-h-[60vh]">
            <div className="max-w-6xl mx-auto px-4 py-20 mt-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <button
                    onClick={() => router.push('/')}
                    className="text-sm text-gray-600 hover:underline mr-4"
                  >
                    ← Back
                  </button>
                  <h1 className="text-3xl font-bold">{categoryName}</h1>
                  <p className="text-gray-600 mt-2">{categoryDesc || `Browse products in the ${categoryName.toLowerCase()} category.`}</p>
                </div>

                {categoryImage && (
                  <div className="hidden md:block w-56 h-40 rounded-lg overflow-hidden shadow-md">
                    <img src={categoryImage} alt={`${categoryName} image`} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {loading ? (
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden p-6 animate-pulse">
                      <div className="flex gap-6">
                        <div className="w-28 h-28 bg-gray-200 rounded-lg" />
                        <div className="flex-1 space-y-3 py-1">
                          <div className="h-6 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                          <div className="h-3 bg-gray-200 rounded w-1/4 mt-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                  {products.map((p, i) => (
                    <ProductCard key={p.id || i} product={p} category={category} />
                  ))}
                  {products.length === 0 && (
                    <div className="p-12 bg-gray-50 rounded-xl text-center text-gray-500">
                      {error ? `Error: ${error}` : 'No products found for this category.'}
                    </div>
                  )}
                </div>
              )}

              {/* Product-specific Packaging Card */}
              {packaging && (
                <div className="mt-20 pt-16 border-t border-gray-200">
                  <h2 className="text-3xl font-bold mb-8 text-center">Packaging for {packaging.name}</h2>
                  <PackagingCard packaging={packaging} />
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}

function ProductCard({ product, category }: { product: any, category: string }) {
  const [open, setOpen] = useState(false)
  const router = require('next/router').useRouter()
  const slug = product.slug || (product.name ? String(product.name).toLowerCase().replace(/\s+/g, '-') : String(product.id || 'product'))
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6 flex gap-6">
        <div className="w-28 h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-500 overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-xs">No Image</div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{product.short_description || product.short}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(!open)}
              className="text-sm text-orange-600 font-medium inline-flex items-center gap-2"
            >
              {open ? (
                <><ChevronUp className="w-4 h-4" /> Details</>
              ) : (
                <><ChevronDown className="w-4 h-4" /> View Details</>
              )}
            </button>

            <button
              onClick={() => router.push(`/products/${category}/${encodeURIComponent(slug)}`)}
              className="ml-2 inline-flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 text-sm text-white rounded-full border border-white/10 transition-all"
            >
              View Product
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <table className="w-full text-sm text-left">
            <tbody>
              {Object.entries(product.details || {}).map(([k, v]) => (
                <tr key={k} className="odd:bg-white even:bg-gray-100">
                  <td className="py-2 pr-4 font-medium text-gray-700 w-48">{k}</td>
                  <td className="py-2 text-gray-700">{String(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function PackagingCard({ packaging }: { packaging: any }) {
  const Icon = packaging.icon
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${packaging.gradient} p-6 text-white flex items-center gap-4`}>
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold">{packaging.name}</h3>
          <p className="text-white/90">Packaging Options & Specifications</p>
        </div>
      </div>

      <div className="p-8">
        <div className="grid md:grid-cols-3 gap-6">
          {packaging.types.map((type: any, i: number) => (
            <div key={i} className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-orange-200 hover:bg-gradient-to-br hover:from-gray-50 hover:to-orange-50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">{type.name}</h4>
              </div>
              <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-3">Specifications:</p>
              <ul className="space-y-2">
                {type.specs.map((spec: string, s: number) => (
                  <li key={s} className="flex gap-2 items-start text-sm text-gray-700">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string
  
  // Map slugs to category names
  const categoryMap: Record<string, string> = {
    'minerals': 'MINERALS',
    'hardware': 'HARDWARE', 
    'petroleum-jelly': 'PETROLEUM JELLY'
  }

  const categoryName = categoryMap[slug] || 'Products'

  return {
    props: {
      category: slug,
      categoryName
    }
  }
}