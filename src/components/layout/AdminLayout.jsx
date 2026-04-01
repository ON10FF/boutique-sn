import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { path: '/admin',            label: 'Dashboard',   icon: LayoutDashboard },
  { path: '/admin/produits',   label: 'Produits',    icon: Package },
  { path: '/admin/commandes',  label: 'Commandes',   icon: ShoppingBag },
  { path: '/admin/livraisons', label: 'Livraisons',  icon: Truck },
  { path: '/admin/clients',    label: 'Clients',     icon: Users },
  { path: '/admin/parametres', label: 'Paramètres',  icon: Settings },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm leading-none">BoutiqueSN</p>
            <p className="text-xs text-gray-400 mt-0.5">Administration</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = path === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(path)
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Déconnexion */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={17} />
          Déconnexion
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-56 bg-white border-r border-gray-100 flex-col fixed h-full">
        <SidebarContent />
      </aside>

      {/* Sidebar mobile — overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-56 bg-white h-full shadow-xl flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">

        {/* Topbar mobile */}
        <header className="md:hidden bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-xl"
          >
            <Menu size={18} />
          </button>
          <span className="font-bold text-gray-800">Admin</span>
          <div className="w-9" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}