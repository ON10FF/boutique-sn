import { useQuery } from '@tanstack/react-query'
import { supabase } from '../services/supabase'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      console.log('CATEGORIES:', data, error)
      if (error) throw error
      return data ?? []
    },
    staleTime: 1000 * 60 * 10 // 10 min — les catégories changent peu
  })
}