import { useQuery } from '@tanstack/react-query'
import { supabase } from '../services/supabase'

// Récupère tous les produits actifs avec leur catégorie
export function useProducts(filters = {}) {
  return useQuery({
    queryKey: ['products', filters],
   queryFn: async () => {
  let query = supabase
    .from('products')
    .select(`
      id, name_fr, name_wo, description_fr, description_wo,
      price, compare_price, stock, images, is_featured,
      category_id
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }
  if (filters.search) {
    query = query.ilike('name_fr', `%${filters.search}%`)
  }
  if (filters.featured) {
    query = query.eq('is_featured', true)
  }

  const { data, error } = await query
  console.log('DATA:', data, 'ERROR:', error)
  if (error) throw error
  return data
},
    staleTime: 1000 * 60 * 5
  })
}

// Récupère un seul produit par son ID
export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name_fr, name_wo, slug)
        `)
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id
  })
}