import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'

export default function ProductGrid({ products, isLoading, columns = 2 }) {
  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }[columns] || 'grid-cols-2'

  if (isLoading) {
    return (
      <div className={`grid ${gridClass} gap-3 md:gap-4`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <div className="text-5xl mb-4">🛍️</div>
        <p className="text-lg font-medium">Aucun produit trouvé</p>
        <p className="text-sm mt-1">Essayez une autre catégorie</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridClass} gap-3 md:gap-4`}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}