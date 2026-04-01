import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, ArrowLeft, MessageCircle, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { useProduct } from '../hooks/useProducts'
import { useCartStore } from '../store/cartStore'
import { formatPrice, t_field, getDiscount } from '../utils/formatters'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [qty, setQty] = useState(1)
  const [imgIndex, setImgIndex] = useState(0)
  const addItem = useCartStore(s => s.addItem)

  const { data: product, isLoading, error } = useProduct(id)

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-2xl mb-4" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-5 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="h-20 bg-gray-200 rounded mb-4" />
        <div className="h-12 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Produit introuvable</p>
        <button onClick={() => navigate('/boutique')} className="mt-4 text-orange-500 font-medium">
          ← Retour à la boutique
        </button>
      </div>
    )
  }

  const name = t_field(product, 'name', lang)
  const description = t_field(product, 'description', lang)
  const discount = getDiscount(product.price, product.compare_price)
  const images = product.images?.length ? product.images : ['/placeholder-product.png']
  const inStock = product.stock > 0

  const handleAddToCart = () => {
    addItem(product, qty)
    navigate('/panier')
  }

  const whatsappMsg = encodeURIComponent(
    `Bonjour, je suis intéressé par : *${name}* — ${formatPrice(product.price)}`
  )
  const whatsappUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${whatsappMsg}`

  return (
    <div>
      {/* Retour */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 mb-4 transition-colors"
      >
        <ArrowLeft size={16} /> Retour
      </button>

      {/* Image principale */}
      <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3">
        <img
          src={images[imgIndex]}
          alt={name}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = '/placeholder-product.png' }}
        />
        {discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Miniatures */}
      {images.length > 1 && (
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setImgIndex(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors
                ${imgIndex === i ? 'border-orange-500' : 'border-transparent'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Infos produit */}
      <div className="mb-6">
        {product.category && (
          <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide mb-1">
            {t_field(product.category, 'name', lang)}
          </p>
        )}

        <h1 className="text-xl font-bold text-gray-800 mb-3">{name}</h1>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-orange-600">
            {formatPrice(product.price)}
          </span>
          {product.compare_price && (
            <span className="text-base text-gray-400 line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>

        {description && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{description}</p>
        )}

        {/* Stock */}
        <p className={`text-xs font-medium ${inStock ? 'text-green-600' : 'text-red-500'}`}>
          {inStock ? `✓ En stock (${product.stock} disponibles)` : '✗ Rupture de stock'}
        </p>
      </div>

      {/* Quantité */}
      {inStock && (
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium text-gray-700">Quantité</span>
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center font-semibold text-sm">{qty}</span>
            <button
              onClick={() => setQty(q => Math.min(product.stock, q + 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Boutons action */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all
            ${inStock
              ? 'bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-lg shadow-orange-200'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          <ShoppingCart size={18} />
          {t('product.add_to_cart')}
        </button>

        {/* Bouton WhatsApp */}
        
        <a  href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm bg-green-500 hover:bg-green-600 active:scale-95 text-white transition-all"
        >
          <MessageCircle size={18} />
          Commander via WhatsApp
        </a>
      </div>
    </div>
  )
}