import { useRouter } from 'next/router'

// Next.js version of navigate function
export default function navigate(path: string) {
  if (typeof window !== 'undefined') {
    window.location.href = path
  }
}

// Hook for Next.js routing
export function useNavigate() {
  const router = useRouter()
  return (path: string) => router.push(path)
}