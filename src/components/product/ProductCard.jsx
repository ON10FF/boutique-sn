import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, Eye } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { formatPrice, t_field, getProductImage, getDiscount } from '../../utils/formatters'

export default function ProductCard({ product }) {
  const { i18n, t } = useTranslation()
  const lang = i18n.language
  const addItem = useCartStore(s => s.addItem)

  const name = t_field(product, 'name', lang)
  const image = getProductImage(product.images)
  const discount = getDiscount(product.price, product.compare_price)
  const inStock = product.stock > 0

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = '/placeholder-product.png' }}
        />

        {/* Badge réduction */}
        {discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}

        {/* Badge rupture */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
              {t('product.out_of_stock')}
            </span>
          </div>
        )}

        {/* Bouton voir rapide */}
        <Link
          to={`/produit/${product.id}`}
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-2 shadow-md hover:bg-orange-50"
        >
          <Eye size={16} className="text-gray-600" />
        </Link>
      </div>

      {/* Infos */}
      <div className="p-3">
        {/* Catégorie */}
        {product.category && (
          <p className="text-xs text-orange-500 font-medium mb-1 uppercase tracking-wide">
            {t_field(product.category, 'name', lang)}
          </p>
        )}

        {/* Nom */}
        <Link to={`/produit/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-orange-600 transition-colors mb-2">
            {name}
          </h3>
        </Link>

        {/* Prix */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold text-orange-600">
            {formatPrice(product.price)}
          </span>
          {product.compare_price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>

        {/* Bouton panier */}
        <button
          onClick={() => inStock && addItem(product)}
          disabled={!inStock}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200
            ${inStock
              ? 'bg-orange-500 hover:bg-orange-600 active:scale-95 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          <ShoppingCart size={15} />
          {t('product.add_to_cart')}
        </button>
      </div>
    </div>
  )
}