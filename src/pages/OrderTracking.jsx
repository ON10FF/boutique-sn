import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getOrderByNumber } from '../services/orderService'
import { formatPrice } from '../utils/formatters'
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react'

const STATUS_STEPS = [
  { key: 'pending',    label: 'En attente',      icon: Clock },
  { key: 'confirmed',  label: 'Confirmée',        icon: CheckCircle },
  { key: 'preparing',  label: 'En préparation',   icon: Package },
  { key: 'shipped',    label: 'En livraison',     icon: Truck },
  { key: 'delivered',  label: 'Livrée',           icon: CheckCircle },
]

export default function OrderTracking() {
  const { orderNumber } = useParams()

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', orderNumber],
    queryFn: () => getOrderByNumber(orderNumber),
    enabled: !!orderNumber
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-16">
        <XCircle size={48} className="text-red-300 mx-auto mb-3" />
        <p className="text-gray-500">Commande introuvable</p>
        <p className="text-sm text-gray-400 mt-1">Vérifiez votre numéro de commande</p>
      </div>
    )
  }

  const currentStep = STATUS_STEPS.findIndex(s => s.key === order.status)

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-1">Suivi commande</h1>
      <p className="text-orange-500 font-bold text-lg mb-6">{order.order_number}</p>

      {/* Timeline statut */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
        {STATUS_STEPS.map((step, index) => {
          const Icon = step.icon
          const isDone = index <= currentStep
          const isCurrent = index === currentStep
          return (
            <div key={step.key} className="flex items-center gap-3 mb-3 last:mb-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${isDone ? 'bg-orange-500' : 'bg-gray-100'}`}>
                <Icon size={14} className={isDone ? 'text-white' : 'text-gray-400'} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isCurrent ? 'text-orange-600' : isDone ? 'text-gray-800' : 'text-gray-400'}`}>
                  {step.label}
                </p>
              </div>
              {isCurrent && (
                <span className="text-xs bg-orange-100 text-orange-600 font-medium px-2 py-0.5 rounded-full">
                  Actuel
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Détails */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">Détails</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Client</span>
            <span className="font-medium">{order.customer_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Téléphone</span>
            <span className="font-medium">{order.customer_phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total</span>
            <span className="font-bold text-orange-600">{formatPrice(order.total_amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Paiement</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full
              ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {order.payment_status === 'paid' ? 'Payé' : 'En attente'}
            </span>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-3">Articles commandés</h2>
        {order.order_items?.map(item => (
          <div key={item.id} className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">{item.product_name} x{item.quantity}</span>
            <span className="font-medium">{formatPrice(item.subtotal)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}