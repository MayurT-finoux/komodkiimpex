import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { supabase, ProductCategory } from '@/lib/supabase'
import { STORAGE_BASE_URL } from '@/lib/config'

export function Products() {
  const router = useRouter()
  const [products, setProducts] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProductCategories()
  }, [])

  const fetchProductCategories = async () => {
    try {
      const { data, error } = await supabase.rpc('get_product_types')
      if (error) throw error
      
      const gradients = [
        'from-blue-600 to-purple-600',
        'from-orange-600 to-red-600', 
        'from-teal-600 to-green-600',
        'from-purple-600 to-pink-600',
        'from-green-600 to-blue-600'
      ]

      const categories = (data || []).map((item: any, index: number) => {
        // Normalize tags whether they're returned as an array or comma-separated string
        const tags = Array.isArray(item.product_tags)
          ? item.product_tags
          : (item.product_tags ? String(item.product_tags).split(',').map((t: string) => t.trim()) : [])

        const imgFile = item.product_type_img || null
        const image = imgFile ? `${STORAGE_BASE_URL}${imgFile}` : undefined

        return {
          id: item.id,
          name: item.product_type,
          slug: item.product_type.toLowerCase().replace(/\s+/g, '-'),
          description: item.product_desc || `High-quality ${item.product_type} products for export`,
          categories: tags,
          bgGradient: gradients[index % gradients.length],
          bg_gradient: gradients[index % gradients.length], // older code expects this too
          product_type_img: imgFile,
          image
        }
      })
      
      setProducts(categories)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError(err instanceof Error ? err.message : 'Failed to load categories')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="products" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40 z-0" />
      <div className="absolute bottom-20 right-0 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-40 z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-4">
            What We Export
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-4">
            Product Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of export-quality products
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 text-left bg-gray-100 animate-pulse p-6 h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 opacity-60" />
                <div className="relative h-80 flex flex-col justify-between z-10 text-transparent">
                  <div className="flex flex-wrap gap-2">
                    <div className="w-24 h-6 bg-white/60 rounded-full" />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-48 h-8 bg-white/60 rounded-md" />
                  </div>
                  <div>
                    <div className="w-full h-3 bg-white/60 rounded-md mb-3" />
                    <div className="w-32 h-3 bg-white/60 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, idx) => {
              const slug = product.slug || product.name.toLowerCase().replace(/\s+/g, '-')
              return (
                <button
                  key={product.id || idx}
                  onClick={() => router.push(`/products/${slug}?typeId=${product.id}`)}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left bg-none border-none p-0 cursor-pointer"
                >
                  {/* Product Background: image covers card if present, otherwise gradient */}
                {product.image ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: `url(${product.image})` } as any}
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.bg_gradient || product.bgGradient} z-0`} />
                )}

                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent z-1" />

                  {/* Content */}
                  <div className="relative h-80 flex flex-col justify-between p-6 text-white z-20 select-none">
                    {/* Top: Categories */}
                    <div className="flex flex-wrap gap-2">
                      {(product.categories || []).slice(0, 2).map((cat, i) => (
                        <span key={i} className="px-3 py-1 text-xs bg-white/10 backdrop-blur-md rounded-full text-white/85 border border-white/20">
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Middle: Title */}
                    <div className="flex items-center justify-center">
                      <h3 className="text-3xl font-bold text-center drop-shadow-lg">{product.name}</h3>
                    </div>

                    {/* Bottom: Description + CTA text */}
                    <div>
                      <p className="text-white/90 text-sm mb-4">{product.description}</p>
                      <span className="inline-flex items-center gap-2 text-orange-300 font-semibold group-hover:text-orange-200 transition-colors">
                        Learn More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}