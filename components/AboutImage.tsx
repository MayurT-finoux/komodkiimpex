import { useEffect, useState } from 'react'

export default function AboutImage() {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch('/api/homepage')
        if (!res.ok) return
        const json = await res.json()
        if (!mounted) return
        if (json.aboutImage) setSrc(json.aboutImage)
      } catch (err) {
        // ignore
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (!src) {
    return (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-orange-500/20" />
      </>
    )
  }

  return <img src={src} alt="About image" className="w-full h-full object-cover" />
}
