import { useAdminStats } from '../../hooks/useAdminStats'
import { formatPrice } from '../../utils/formatters'
import { ShoppingBag, Package, Users, TrendingUp, Clock, AlertTriangle } from 'lucide-react'

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800 mb-1">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const { data: stats, isLoading } = useAdminStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse h-28" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Vue d'ensemble de votre boutique</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <StatCard
          label="Chiffre d'affaires"
          value={formatPrice(stats?.revenue || 0)}
          icon={TrendingUp}
          color="bg-orange-500"
          sub="commandes payées"
        />
        <StatCard
          label="Commandes"
          value={stats?.totalOrders || 0}
          icon={ShoppingBag}
          color="bg-blue-500"
          sub={`${stats?.pending || 0} en attente`}
        />
        <StatCard
          label="Produits"
          value={stats?.totalProducts || 0}
          icon={Package}
          color="bg-purple-500"
          sub={stats?.lowStock > 0 ? `⚠️ ${stats.lowStock} stock faible` : 'Stocks OK'}
        />
        <StatCard
          label="Clients"
          value={stats?.totalCustomers || 0}
          icon={Users}
          color="bg-green-500"
        />
        <StatCard
          label="En attente"
          value={stats?.pending || 0}
          icon={Clock}
          color="bg-yellow-500"
          sub="à traiter"
        />
        <StatCard
          label="Stock faible"
          value={stats?.lowStock || 0}
          icon={AlertTriangle}
          color="bg-red-500"
          sub="≤ 3 articles"
        />
      </div>

      {/* Activité 7 jours */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-4">Commandes — 7 derniers jours</h2>
        <div className="flex items-end gap-2 h-24">
          {stats?.ordersByDay?.map((d, i) => {
            const max = Math.max(...(stats.ordersByDay.map(x => x.count)), 1)
            const height = d.count === 0 ? 4 : Math.max(12, (d.count / max) * 96)
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-gray-600">{d.count || ''}</span>
                <div
                  className="w-full bg-orange-500 rounded-t-lg transition-all"
                  style={{ height: `${height}px` }}
                />
                <span className="text-xs text-gray-400">{d.day}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}