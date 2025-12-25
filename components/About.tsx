import { CheckCircle, Award, Users, Target } from 'lucide-react'
import AboutImage from '@/components/AboutImage'
import { useEffect, useState } from 'react'

export function About() {
  const highlights = [
    { icon: Award, text: '15+ years of industry excellence' },
    { icon: Users, text: 'Serving 50+ countries worldwide' },
    { icon: Target, text: '1000+ satisfied clients' },
    { icon: CheckCircle, text: 'ISO certified operations' },
    { icon: CheckCircle, text: '24/7 customer support' },
    { icon: CheckCircle, text: 'Competitive pricing guaranteed' },
  ]

  const values = [
    { title: 'Excellence', description: 'Uncompromising quality in every transaction' },
    { title: 'Partnership', description: 'Building long-term relationships with clients' },
    { title: 'Reliability', description: 'Consistent, dependable service delivery' },
  ]

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Image Side */}
          <div className="relative">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              {/* Image (from homepage data) or placeholder gradient - render placeholder on server/initial client */}
              {mounted ? (
                <AboutImage />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-orange-500/20" />
                </>
              )}
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
              <div className="flex items-center gap-4">
                <Award className="w-8 h-8 text-orange-500" />
                <div>
                  <h4 className="font-bold text-lg text-gray-900">15+ Years</h4>
                  <p className="text-sm text-gray-600">Of Excellence in Global Trade</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">About Komodki Impex</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Komodki Impex is a professionally managed global trading company based in Mumbai, India. We specialize in the sourcing and supply of quality commodities across international and domestic markets. Our portfolio includes industrial minerals, hardware products, and personal care items such as petroleum jelly, sourced from trusted production partners.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We emphasize strict quality standards, efficient logistics, and consistent supply. Driven by integrity and market expertise, Komodki Impex is committed to building long-term partnerships and delivering value-focused trade solutions worldwide.
            </p>

            {/* Values Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {values.map((value, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                  <h4 className="font-bold text-gray-900 mb-1">{value.title}</h4>
                  <p className="text-xs text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {highlights.map((highlight, idx) => {
            const Icon = highlight.icon
            return (
              <div key={idx} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all">
                <Icon className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <p className="font-semibold text-gray-900">{highlight.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}