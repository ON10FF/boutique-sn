import { useQuery } from '@tanstack/react-query'
import { supabase } from '../services/supabase'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [ordersRes, productsRes, customersRes, revenueRes] = await Promise.all([
        supabase.from('orders').select('id, status, created_at', { count: 'exact' }),
        supabase.from('products').select('id, stock', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'customer'),
        supabase.from('orders').select('total_amount, payment_status').eq('payment_status', 'paid')
      ])

      const orders = ordersRes.data || []
      const products = productsRes.data || []

      const revenue = (revenueRes.data || []).reduce((acc, o) => acc + o.total_amount, 0)
      const pending = orders.filter(o => o.status === 'pending').length
      const lowStock = products.filter(p => p.stock <= 3).length

      // Commandes des 7 derniers jours
      const last7days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        return d.toISOString().split('T')[0]
      })

      const ordersByDay = last7days.map(day => ({
        day: day.slice(5),
        count: orders.filter(o => o.created_at?.startsWith(day)).length
      }))

      return {
        totalOrders: ordersRes.count || 0,
        totalProducts: productsRes.count || 0,
        totalCustomers: customersRes.count || 0,
        revenue,
        pending,
        lowStock,
        ordersByDay
      }
    },
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 5
  })
}