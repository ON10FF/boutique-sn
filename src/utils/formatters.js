// Formate un prix en FCFA
export function formatPrice(amount) {
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

// Retourne le bon champ selon la langue active
export function t_field(obj, field, lang = 'fr') {
  const localizedField = `${field}_${lang}`
  return obj?.[localizedField] || obj?.[`${field}_fr`] || ''
}

// Retourne la première image ou un placeholder
export function getProductImage(images) {
  if (images && images.length > 0) return images[0]
  return 'https://placehold.co/400x400/f3f4f6/9ca3af?text=Produit'
}

// Calcule le pourcentage de réduction
export function getDiscount(price, comparePrice) {
  if (!comparePrice || comparePrice <= price) return null
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}