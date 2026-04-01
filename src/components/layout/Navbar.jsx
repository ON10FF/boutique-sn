import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const totalItems = useCartStore(s => s.getTotalItems())
  const { user, isAdmin } = useAuthStore()

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'wo' : 'fr')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-gray-800 text-lg">
              Boutique<span className="text-orange-500">SN</span>
            </span>
          </Link>

          {/* Nav desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/boutique"
              className={`text-sm font-medium transition-colors ${location.pathname === '/boutique' ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
            >
              {t('nav.shop')}
            </Link>
            {isAdmin() && (
              <Link to="/admin" className="text-sm font-medium text-purple-600 hover:text-purple-700">
                {t('nav.admin')}
              </Link>
            )}
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-2">

            {/* Sélecteur de langue */}
            <button
              onClick={toggleLang}
              className="hidden md:flex items-center gap-1 text-xs font-semibold bg-gray-100 hover:bg-orange-50 text-gray-600 hover:text-orange-600 px-2 py-1 rounded-lg transition-colors"
            >
              {i18n.language === 'fr' ? '🇸🇳 WO' : '🇫🇷 FR'}
            </button>

            {/* Recherche */}
            <Link to="/boutique" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Search size={18} className="text-gray-600" />
            </Link>

            {/* Panier */}
            <Link to="/panier" className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ShoppingCart size={18} className="text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Compte */}
            <Link
              to={user ? '/compte' : '/connexion'}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <User size={18} className="text-gray-600" />
            </Link>

            {/* Menu burger mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 flex flex-col gap-1">
            <Link to="/" onClick={() => setMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl">
              {t('nav.home')}
            </Link>
            <Link to="/boutique" onClick={() => setMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl">
              {t('nav.shop')}
            </Link>
            {isAdmin() && (
              <Link to="/admin" onClick={() => setMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-xl">
                {t('nav.admin')}
              </Link>
            )}
            <button onClick={toggleLang}
              className="mx-3 mt-2 py-2 text-sm font-semibold bg-gray-100 hover:bg-orange-50 text-gray-600 hover:text-orange-600 rounded-xl transition-colors">
              {i18n.language === 'fr' ? '🇸🇳 Passer en Wolof' : '🇫🇷 Passer en Français'}
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}