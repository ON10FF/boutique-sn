import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../services/supabase'

export function useAdminOrders(filters = {}) {
  return useQuery({
    queryKey: ['admin-orders', filters],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items(id, product_name, quantity, unit_price, subtotal),
          delivery_zone:delivery_zones(name, city)
        `)
        .order('created_at', { ascending: false })

      if (filters.status) query = query.eq('status', filters.status)
      if (filters.payment) query = query.eq('payment_status', filters.payment)

      const { data, error } = await query
      if (error) throw error
      return data
    },
    refetchInterval: 1000 * 30
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status, payment_status }) => {
      const updates = {}
      if (status) updates.status = status
      if (payment_status) updates.payment_status = payment_status

      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
    }
  })
}