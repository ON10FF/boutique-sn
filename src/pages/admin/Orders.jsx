import { useState } from 'react'
import { useAdminOrders, useUpdateOrderStatus } from '../../hooks/useAdminOrders'
import { formatPrice } from '../../utils/formatters'
import { MessageCircle, ChevronDown, Loader2 } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'pending',   label: 'En attente',    color: 'bg-yellow-100 text-yellow-700' },
  { value: 'confirmed', label: 'Confirmée',      color: 'bg-blue-100 text-blue-700' },
  { value: 'preparing', label: 'En préparation', color: 'bg-purple-100 text-purple-700' },
  { value: 'shipped',   label: 'En livraison',   color: 'bg-indigo-100 text-indigo-700' },
  { value: 'delivered', label: 'Livrée',         color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: 'Annulée',        color: 'bg-red-100 text-red-600' },
]

const PAYMENT_OPTIONS = [
  { value: 'pending',  label: 'Non payé',  color: 'bg-yellow-100 text-yellow-700' },
  { value: 'paid',     label: 'Payé',      color: 'bg-green-100 text-green-700' },
  { value: 'failed',   label: 'Échoué',    color: 'bg-red-100 text-red-600' },
]

function StatusBadge({ status, options }) {
  const opt = options.find(o => o.value === status)
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${opt?.color || 'bg-gray-100 text-gray-600'}`}>
      {opt?.label || status}
    </span>
  )
}

export default function Orders() {
  const [filterStatus, setFilterStatus] = useState('')
  const { data: orders, isLoading } = useAdminOrders({ status: filterStatus || undefined })
  const updateStatus = useUpdateOrderStatus()
  const [expanded, setExpanded] = useState(null)

  const sendWhatsApp = (order) => {
    const msg = encodeURIComponent(
      `Bonjour ${order.customer_name} 👋\n\nVotre commande *${order.order_number}* est confirmée.\nMontant : *${order.total_amount.toLocaleString()} FCFA*\n\nMerci pour votre confiance ! 🙏`
    )
    window.open(`https://wa.me/${order.customer_phone.replace(/\s/g, '')}?text=${msg}`, '_blank')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Commandes</h1>
          <p className="text-sm text-gray-400">{orders?.length || 0} commande(s)</p>
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="">Toutes</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders?.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Header commande */}
              <div
                className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-sm text-gray-800">{order.order_number}</span>
                    <StatusBadge status={order.status} options={STATUS_OPTIONS} />
                    <StatusBadge status={order.payment_status} options={PAYMENT_OPTIONS} />
                  </div>
                  <p className="text-sm text-gray-600">{order.customer_name} · {order.customer_phone}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-orange-600 text-sm">{formatPrice(order.total_amount)}</p>
                  <p className="text-xs text-gray-400 capitalize">{order.payment_method?.replace('_', ' ')}</p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform flex-shrink-0 ${expanded === order.id ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Détail expansible */}
              {expanded === order.id && (
                <div className="border-t border-gray-100 p-4">
                  {/* Articles */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Articles</p>
                    {order.order_items?.map(item => (
                      <div key={item.id} className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{item.product_name} x{item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Adresse */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Livraison</p>
                    <p className="text-sm text-gray-600">
                      {order.delivery_address?.address} — {order.delivery_address?.zone}
                    </p>
                  </div>

                  {/* Actions statut */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Statut commande</label>
                      <select
                        value={order.status}
                        onChange={e => updateStatus.mutate({ id: order.id, status: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Statut paiement</label>
                      <select
                        value={order.payment_status}
                        onChange={e => updateStatus.mutate({ id: order.id, payment_status: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                      >
                        {PAYMENT_OPTIONS.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <button
                    onClick={() => sendWhatsApp(order)}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                  >
                    <MessageCircle size={15} />
                    Notifier le client via WhatsApp
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}