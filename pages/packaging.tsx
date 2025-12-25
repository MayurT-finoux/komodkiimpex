import Head from 'next/head'
import { Header } from '@/components/Header'
import { Packaging } from '@/components/Packaging'
import { Footer } from '@/components/Footer'

export default function PackagingPage() {
  return (
    <>
      <Head>
        <title>Packaging Solutions - Komodki Impex</title>
        <meta name="description" content="Professional packaging solutions for minerals, hardware, and petroleum jelly exports. Secure and certified packaging for worldwide delivery." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-white bg-surface">
        <Header />
        <main>
          <Packaging />
        </main>
        <Footer />
      </div>
    </>
  )
}