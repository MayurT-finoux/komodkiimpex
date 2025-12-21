import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Globe, Package, TrendingUp } from 'lucide-react'

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    { title: 'Premium Minerals & Ores' },
    { title: 'Quality Hardware Solutions' },
    { title: 'Pharmaceutical Grade Petroleum Jelly' },
  ]

  const stats = [
    { value: '50+', label: 'Countries Served', icon: Globe },
    { value: '1000+', label: 'Products Exported', icon: Package },
    { value: '15+', label: 'Years Experience', icon: TrendingUp },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section id="home" className="relative w-full min-h-screen overflow-hidden flex items-center pt-20">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/80 to-orange-900/80 z-0" />

      {/* Decorative blur circles */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl opacity-10 z-0" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 z-0" />

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/30 transition-all"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/30 transition-all"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-48 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'w-12 bg-orange-500' : 'w-8 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-10 leading-tight">
            Welcome to <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">Komodki Impex</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-10 leading-relaxed">
            Your trusted global partner for premium minerals, hardware, and petroleum jelly
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-16">
            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Get Started
              <span className="ml-2 text-lg">→</span>
            </button>
            <button className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold backdrop-blur-md border border-white/20 transition-all">
              Learn More
              <span className="ml-2 text-lg">→</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-gray-300 text-sm">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}