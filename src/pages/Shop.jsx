import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import ProductGrid from '../components/product/ProductGrid'
import { t_field } from '../utils/formatters'

export default function Shop() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const [search, setSearch]         = useState('')
  const [selectedCat, setSelectedCat] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const { data: categories } = useCategories()
  const { data: products, isLoading } = useProducts({
    categoryId: selectedCat,
    search: search.length >= 2 ? search : undefined
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('nav.shop')}</h1>
        <p className="text-sm text-gray-500">
          {products ? `${products.length} produits` : '...'}
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={t('common.search') + '...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X size={14} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Filtres catégories — scroll horizontal sur mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <button
          onClick={() => setSelectedCat(null)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border
            ${!selectedCat
              ? 'bg-orange-500 text-white border-orange-500'
              : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
            }`}
        >
          Tout
        </button>
        {categories?.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(selectedCat === cat.id ? null : cat.id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border
              ${selectedCat === cat.id
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
              }`}
          >
            {t_field(cat, 'name', lang)}
          </button>
        ))}
      </div>

      {/* Grille produits */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        columns={2}
      />
    </div>
  )
}