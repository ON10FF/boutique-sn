import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import ProductGrid from '../components/product/ProductGrid'
import { t_field } from '../utils/formatters'

export default function Home() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: featured, isLoading } = useProducts({ featured: true })
  const { data: categories } = useCategories()

  const whatsappUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour, je voudrais passer une commande')}`

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 mb-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-orange-100 text-sm font-medium mb-1">🇸🇳 Livraison partout au Sénégal</p>
          <h1 className="text-2xl font-bold mb-2 leading-tight">
            Bienvenue sur<br />BoutiqueSN
          </h1>
          <p className="text-orange-100 text-sm mb-5">
            Paiement Wave, Orange Money, ou à la livraison
          </p>
          <Link
            to="/boutique"
            className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors"
          >
            {t('nav.shop')} <ArrowRight size={15} />
          </Link>
        </div>
        {/* Déco */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-orange-400/30 rounded-full" />
        <div className="absolute -right-2 -top-6 w-20 h-20 bg-orange-400/20 rounded-full" />
      </div>

      {/* Catégories */}
      {categories && categories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Catégories</h2>
          <div className="grid grid-cols-4 gap-3">
            {categories.slice(0, 4).map(cat => (
              <Link
                key={cat.id}
                to={`/boutique?cat=${cat.id}`}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl">
                  {cat.slug === 'alimentation' ? '🛒' :
                   cat.slug === 'vetements' ? '👕' :
                   cat.slug === 'electronique' ? '📱' : '🏠'}
                </div>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                  {t_field(cat, 'name', lang)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Produits vedettes */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Produits vedettes</h2>
          <Link to="/boutique" className="text-sm text-orange-500 font-medium flex items-center gap-1">
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>
        <ProductGrid products={featured} isLoading={isLoading} columns={2} />
      </section>

      {/* Bouton WhatsApp flottant */}
      
      <a  href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-4 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm px-4 py-3 rounded-2xl shadow-xl shadow-green-200 active:scale-95 transition-all"
      >
        <MessageCircle size={18} />
        WhatsApp
      </a>
    </div>
  )
}