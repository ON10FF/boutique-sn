import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { formatPrice, t_field, getProductImage } from '../utils/formatters'

export default function Cart() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity, getSubtotal, getTotalItems } = useCartStore()
  const subtotal = getSubtotal()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingBag size={56} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">{t('cart.empty')}</h2>
        <p className="text-sm text-gray-400 mb-6">Ajoutez des produits pour continuer</p>
        <Link
          to="/boutique"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-2xl transition-colors"
        >
          {t('cart.continue_shopping')}
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {t('cart.title')} ({getTotalItems()})
      </h1>

      {/* Liste articles */}
      <div className="flex flex-col gap-3 mb-6">
        {items.map(item => {
          const name = t_field(item, 'name', lang)
          const image = getProductImage(item.images)
          return (
            <div key={item.id} className="bg-white rounded-2xl p-3 flex gap-3 border border-gray-100">
              {/* Image */}
              <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = 'https://placehold.co/80x80/f3f4f6/9ca3af?text=?' }}
                />
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{name}</h3>
                <p className="text-orange-600 font-bold text-sm mb-2">{formatPrice(item.price)}</p>

                {/* Quantité + Supprimer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Récapitulatif */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Sous-total</span>
          <span className="text-sm font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Livraison</span>
          <span className="text-xs text-orange-500 font-medium">calculée à l'étape suivante</span>
        </div>
        <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
          <span className="font-bold text-gray-800">Total estimé</span>
          <span className="font-bold text-orange-600 text-lg">{formatPrice(subtotal)}</span>
        </div>
      </div>

      {/* Bouton commander */}
      <button
        onClick={() => navigate('/commande')}
        className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200"
      >
        {t('cart.checkout')} <ArrowRight size={18} />
      </button>

      <Link
        to="/boutique"
        className="block text-center text-sm text-gray-500 hover:text-orange-500 mt-4 transition-colors"
      >
        ← {t('cart.continue_shopping')}
      </Link>
    </div>
  )
}