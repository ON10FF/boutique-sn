import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useDeliveryZones } from '../hooks/useDeliveryZones'
import { createOrder } from '../services/orderService'
import { getWavePaymentLink, getOrangeMoneyLink, getWhatsAppOrderMessage } from '../utils/payment'
import { formatPrice } from '../utils/formatters'
import { Loader2, MapPin, CreditCard, User } from 'lucide-react'

const PAYMENT_METHODS = [
  { id: 'wave',         label: 'Wave',              icon: '🔵', color: 'border-blue-400 bg-blue-50' },
  { id: 'orange_money', label: 'Orange Money',       icon: '🟠', color: 'border-orange-400 bg-orange-50' },
  { id: 'free_money',   label: 'Free Money',         icon: '🟢', color: 'border-green-400 bg-green-50' },
  { id: 'cash',         label: 'Cash à la livraison',icon: '💵', color: 'border-gray-400 bg-gray-50' },
]

export default function Checkout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { items, getSubtotal, clearCart } = useCartStore()
  const { user, profile } = useAuthStore()
  const { data: zones } = useDeliveryZones()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedZone, setSelectedZone] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState('wave')

  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    email: user?.email || '',
    address: ''
  })

  const subtotal = getSubtotal()
  const deliveryFee = selectedZone?.fee || 0
  const total = subtotal + deliveryFee

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    // Validation
    if (!form.full_name || !form.phone || !form.address) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
    if (!selectedZone) {
      setError('Veuillez choisir une zone de livraison')
      return
    }
    if (items.length === 0) {
      setError('Votre panier est vide')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const order = await createOrder({
        customer: { ...form, id: user?.id },
        cart: items,
        deliveryZone: selectedZone,
        paymentMethod: selectedPayment
      })

      // Message WhatsApp auto
      const waMsg = getWhatsAppOrderMessage({ order, items: items.map(i => ({
        product_name: i.name_fr,
        quantity: i.quantity,
        subtotal: i.price * i.quantity
      }))})
      const waUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${waMsg}`

      clearCart()

      // Redirige selon le mode de paiement
      if (selectedPayment === 'wave') {
        const payLink = getWavePaymentLink({ amount: total, orderId: order.id })
        window.open(payLink, '_blank')
      } else if (selectedPayment === 'orange_money') {
        const payLink = getOrangeMoneyLink({ amount: total, orderId: order.id })
        window.open(payLink, '_blank')
      }

      // Ouvre WhatsApp
      window.open(waUrl, '_blank')

      navigate(`/commande/succes/${order.id}`, {
        state: { order, paymentMethod: selectedPayment }
      })

    } catch (err) {
      setError('Erreur lors de la commande. Réessayez.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    navigate('/panier')
    return null
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('checkout.title')}</h1>

      {/* Infos client */}
      <section className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-orange-500" />
          <h2 className="font-semibold text-gray-800">{t('checkout.your_info')}</h2>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              {t('checkout.full_name')} *
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Prénom Nom"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              {t('checkout.phone')} *
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="77 000 00 00"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              {t('checkout.address')} *
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Rue, quartier, point de repère..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>
      </section>

      {/* Zone de livraison */}
      <section className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={16} className="text-orange-500" />
          <h2 className="font-semibold text-gray-800">{t('checkout.delivery_zone')}</h2>
        </div>
        <div className="flex flex-col gap-2">
          {zones?.map(zone => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={`flex justify-between items-center p-3 rounded-xl border-2 text-left transition-all
                ${selectedZone?.id === zone.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-100 hover:border-orange-200'
                }`}
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{zone.name}</p>
                <p className="text-xs text-gray-400">{zone.city} · {zone.estimated_days} jour(s)</p>
              </div>
              <span className={`text-sm font-bold ${selectedZone?.id === zone.id ? 'text-orange-600' : 'text-gray-600'}`}>
                {zone.fee === 0 ? 'Gratuit' : formatPrice(zone.fee)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Mode de paiement */}
      <section className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={16} className="text-orange-500" />
          <h2 className="font-semibold text-gray-800">{t('checkout.payment_method')}</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map(pm => (
            <button
              key={pm.id}
              onClick={() => setSelectedPayment(pm.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all
                ${selectedPayment === pm.id
                  ? `${pm.color} border-2`
                  : 'border-gray-100 hover:border-gray-200'
                }`}
            >
              <span className="text-2xl">{pm.icon}</span>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">{pm.label}</span>
            </button>
          ))}
        </div>

        {selectedPayment === 'wave' && (
          <p className="mt-3 text-xs text-blue-600 bg-blue-50 rounded-xl p-3">
            🔵 Vous serez redirigé vers Wave pour payer après confirmation
          </p>
        )}
        {selectedPayment === 'orange_money' && (
          <p className="mt-3 text-xs text-orange-600 bg-orange-50 rounded-xl p-3">
            🟠 Vous serez redirigé vers Orange Money après confirmation
          </p>
        )}
        {selectedPayment === 'cash' && (
          <p className="mt-3 text-xs text-green-600 bg-green-50 rounded-xl p-3">
            💵 Paiement en espèces à la livraison
          </p>
        )}
      </section>

      {/* Récap total */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">{t('checkout.order_summary')}</h2>
        {items.map(item => (
          <div key={item.id} className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-600 line-clamp-1 flex-1 mr-2">{item.name_fr} x{item.quantity}</span>
            <span className="font-medium flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-gray-100 mt-3 pt-3 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Sous-total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Livraison</span>
            <span>{selectedZone ? formatPrice(deliveryFee) : '—'}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-1">
            <span>Total</span>
            <span className="text-orange-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* Bouton confirmer */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200 active:scale-95"
      >
        {loading ? (
          <><Loader2 size={18} className="animate-spin" /> Traitement...</>
        ) : (
          <>{t('checkout.confirm_order')} — {formatPrice(total)}</>
        )}
      </button>
    </div>
  )
}