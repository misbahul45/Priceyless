import { createFileRoute } from '@tanstack/react-router'
import {
  Package,
  Tags,
  Users,
  LayoutDashboard,
} from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const stats = [
    {
      icon: <Package className="w-8 h-8 text-cyan-400" />,
      title: 'Total Products',
      value: '0',
    },
    {
      icon: <Tags className="w-8 h-8 text-purple-400" />,
      title: 'Categories',
      value: '0',
    },
    {
      icon: <Users className="w-8 h-8 text-green-400" />,
      title: 'Active Users',
      value: '1',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="max-w-7xl mx-auto py-12 px-6">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-2 text-cyan-400">
            <LayoutDashboard size={24} />
            <span className="font-semibold uppercase tracking-widest text-sm">Overview</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight">Dashboard</h2>
          <p className="text-slate-400 mt-2">Welcome to Priceyless management system.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-6"
            >
              <div className="bg-slate-800 p-3 rounded-xl">{stat.icon}</div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Package className="text-slate-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">No data available yet</h3>
              <p className="text-slate-400 mb-8">
                The system is currently in skeleton mode. Once the backend is connected, you'll see your products and categories here.
              </p>
              <div className="flex justify-center gap-4">
                <div className="px-6 py-2 bg-slate-800 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed">
                  Add Product
                </div>
                <div className="px-6 py-2 bg-slate-800 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed">
                  Add Category
                </div>
              </div>
            </div>
          </section>
      </main>
    </div>
  )
}
