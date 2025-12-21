import { Shield, CheckCircle, Truck, Package, Box, Layers, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function Packaging() {
  const router = useRouter()
  const isPackagingPage = router.pathname === '/packaging'
  const [packagingTypes, setPackagingTypes] = useState<any[]>([])

  const features = [
    { icon: Shield, title: 'Quality Protection', description: 'Multi-layer packaging ensures product safety during transit' },
    { icon: CheckCircle, title: 'Certified Standards', description: 'All packaging meets international export regulations' },
    { icon: Truck, title: 'Transport Ready', description: 'Optimized for sea, air, and land freight' },
  ]

  useEffect(() => {
    fetchPackaging()
  }, [])

  const fetchPackaging = async () => {
    try {
      const { data, error } = await supabase.rpc('get_product_packaging')
      if (error) throw error
      const grouped: Record<string, any> = {}
      ;(data || []).forEach((row: any) => {
        const id = String(row.product_type_id)
        if (!grouped[id]) grouped[id] = { id, name: row.product_type, types: [] }

        // pkg_specs may be stored as JSON string or object - handle both
        let specsObj: any = row.pkg_specs || {}
        if (typeof specsObj === 'string') {
          try {
            specsObj = JSON.parse(specsObj)
          } catch (e) {
            // try to clean up newlines and parse loosely
            try {
              specsObj = JSON.parse(specsObj.replace(/\r\n|\n/g, ''))
            } catch (err) {
              specsObj = {}
            }
          }
        }

        // Collect any keys that look like spec*, sort by numeric order when possible
        const specs: string[] = []
        try {
          Object.keys(specsObj || {}).forEach((k) => {
            if (/^spec\d*/i.test(k)) specs.push(String(specsObj[k]).trim())
          })
          // If no spec* keys found, also try generic values
          if (specs.length === 0) {
            Object.values(specsObj || {}).forEach((v) => {
              if (v) specs.push(String(v).trim())
            })
          }
        } catch (err) {
          console.warn('Failed to parse pkg_specs for product_type_id', id, err)
        }

        grouped[id].types.push({ name: row.pkg_type, specs })
      })

      const arr = Object.values(grouped).slice(0, 3)
      setPackagingTypes(arr)
    } catch (err) {
      console.error('Failed loading packaging:', err)
    }
  }

  const gradients = ['from-blue-600 to-purple-600', 'from-orange-600 to-red-600', 'from-teal-600 to-green-600', 'from-purple-600 to-pink-600']
  const iconMap: Record<string, any> = { Minerals: Package, Hardware: Box, 'Petroleum Jelly': Layers }

  return (
    <section id="packaging" className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 z-0" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-30 z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-4">
            Packaging Solutions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-4">
            Professional Packaging
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Secure and certified packaging solutions for safe delivery worldwide
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div key={idx} className="flex gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Product Packaging Cards (first 3 product types) */}
        <div className="space-y-12">
          {packagingTypes.map((product, idx) => {
            const Icon = iconMap[product.name] || Package
            const gradient = gradients[idx % gradients.length]
            return (
              <div key={product.id || idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className={`bg-gradient-to-r ${gradient} p-6 text-white flex items-center gap-4`}>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{product.name}</h3>
                    <p className="text-white/90">Packaging Options & Specifications</p>
                  </div>
                </div>

                {/* Types Grid */}
                <div className="p-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    {product.types.map((type: any, i: number) => (
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
          })}
        </div>

        {/* Learn More Button (hidden on /packaging) */}
        {!isPackagingPage && (
          <div className="mt-16 text-center">
            <button
              onClick={() => router.push('/packaging')}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl inline-flex gap-2"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}