import { useLocation, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, MessageCircle, Home } from 'lucide-react'
import { formatPrice } from '../utils/formatters'

export default function OrderSuccess() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const order = state?.order

  if (!order) {
    navigate('/')
    return null
  }

  const waMsg = encodeURIComponent(
    `Bonjour, je voudrais suivre ma commande N° *${order.order_number}*`
  )
  const waUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${waMsg}`

  return (
    <div className="flex flex-col items-center text-center py-10">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle size={40} className="text-green-500" />
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">Commande confirmée !</h1>
      <p className="text-gray-500 text-sm mb-1">Votre commande a bien été enregistrée</p>
      <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 mb-6">
        <p className="text-xs text-orange-500 font-medium">Numéro de commande</p>
        <p className="text-xl font-bold text-orange-600">{order.order_number}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 w-full mb-6 text-left">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Montant total</span>
          <span className="font-bold text-orange-600">{formatPrice(order.total_amount)}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Paiement</span>
          <span className="font-medium capitalize">{order.payment_method.replace('_', ' ')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Statut</span>
          <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">
            En attente
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Notez votre numéro de commande pour le suivi. Vous pouvez aussi nous contacter via WhatsApp.
      </p>

      <div className="flex flex-col gap-3 w-full">
        
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-2xl transition-colors"
        <a>
          <MessageCircle size={18} />
          Suivre via WhatsApp
        </a>
        <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-2xl transition-colors"
        >
          <Home size={18} />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}