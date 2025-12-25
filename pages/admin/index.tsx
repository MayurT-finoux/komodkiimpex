import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Lock, Eye, EyeOff, LogOut, Users, Package, Mail, BarChart3, Settings, Globe } from 'lucide-react'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated (session storage)
    const authStatus = sessionStorage.getItem('komodki_admin_auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
    sessionStorage.setItem('komodki_admin_auth', 'true')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('komodki_admin_auth')
  }

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <>
      <Head>
        <title>Admin Panel - Komodki Impex</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {!isAuthenticated ? (
        <AdminLogin onLogin={handleLogin} />
      ) : (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </>
  )
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Try calling Supabase RPC admin_login. Provide both common param names in case the function expects different names.
      const { data, error } = await (await import('@/lib/supabase')).supabase.rpc('admin_login', {
        username,
        password,
        p_username: username,
        p_password: password
      } as any)

      console.debug('admin_login result:', { data, error })

      if (error) {
        console.error('admin_login RPC error:', error)
        setError((error as any)?.message || 'Login failed')
      } else {
        // Accept multiple possible response shapes: array of rows, single object, or other truthy responses
        const hasRow = (Array.isArray(data) && data.length > 0) || (data && typeof data === 'object' && (data.admin_id || data.username))
        const firstRow: any = Array.isArray(data) ? data[0] : data

        if (hasRow) {
          // Persist basic admin info to sessionStorage for dashboard usage
          try {
            const adminId = firstRow?.admin_id ?? firstRow?.id ?? ''
            const adminUser = firstRow?.username ?? firstRow?.user ?? ''
            sessionStorage.setItem('komodki_admin_auth', 'true')
            sessionStorage.setItem('komodki_admin_username', String(adminUser))
            sessionStorage.setItem('komodki_admin_id', String(adminId))
          } catch (e) {
            console.warn('Failed to store admin session:', e)
          }

          onLogin()
        } else {
          setError('Invalid credentials')
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-900 to-orange-900 flex items-center justify-center p-4">
      {/* Decorative blur circles */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl opacity-10" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10" />

      <div className="glass max-w-md w-full p-8 rounded-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text mb-2">Admin Access</h1>
          <p className="text-gray-600">Sign in with your admin username and password</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Admin username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-12"
                placeholder="Enter admin password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label: 'Total Inquiries', value: '156', icon: Mail, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Products', value: '24', icon: Package, color: 'from-orange-500 to-orange-600' },
    { label: 'Countries Served', value: '52', icon: Globe, color: 'from-green-500 to-green-600' },
    { label: 'Monthly Orders', value: '89', icon: BarChart3, color: 'from-purple-500 to-purple-600' },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inquiries', label: 'Inquiries', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🌍</div>
              <div>
                <h1 className="gradient-text font-bold text-lg">Komodki Impex</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-orange-600 text-sm"
              >
                View Website
              </button>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600 bg-orange-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Dashboard Overview</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-900 mb-2">Recent Activity</h4>
                    <p className="text-sm text-blue-700">5 new inquiries in the last 24 hours</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <h4 className="font-medium text-orange-900 mb-2">System Status</h4>
                    <p className="text-sm text-orange-700">All systems operational</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Product Management</h3>
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Product management features will be available once database is connected.</p>
                </div>
              </div>
            )}

            {activeTab === 'inquiries' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Customer Inquiries</h3>
                <div className="text-center py-12 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Inquiry management features will be available once database is connected.</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
                <div className="text-center py-12 text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Settings panel will be available once database is connected.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}