export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3">
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-9 bg-gray-200 rounded-xl" />
      </div>
    </div>
  )
}