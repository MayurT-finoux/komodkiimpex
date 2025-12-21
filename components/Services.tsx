import { Globe, Package, Truck, FileCheck, ShieldCheck, TrendingUp } from 'lucide-react'

export function Services() {
  const services = [
    { icon: Globe, title: 'Global Network', description: 'Extensive network spanning across 50+ countries worldwide for seamless trade operations.' },
    { icon: Package, title: 'Quality Assurance', description: 'Rigorous quality control processes ensuring only the finest products reach our clients.' },
    { icon: Truck, title: 'Logistics Excellence', description: 'Efficient shipping and handling with real-time tracking for complete transparency.' },
    { icon: FileCheck, title: 'Documentation Support', description: 'Complete assistance with export documentation, customs, and compliance requirements.' },
    { icon: ShieldCheck, title: 'Secure Transactions', description: 'Safe and secure payment methods with full legal compliance and protection.' },
    { icon: TrendingUp, title: 'Market Insights', description: 'Expert market analysis and trends to help you make informed business decisions.' },
  ]

  const gradients = [
    'from-blue-500 to-blue-600',
    'from-orange-500 to-orange-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-red-500 to-red-600',
    'from-teal-500 to-teal-600',
  ]

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-30 z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-orange-100 rounded-full text-orange-600 font-medium text-sm mb-4">
            What We Offer
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive export solutions tailored to meet your business needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${gradients[idx]} rounded-xl flex items-center justify-center mb-6 transform hover:scale-110 hover:rotate-6 transition-transform shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}