// Génère le lien Wave
export function getWavePaymentLink({ amount, orderId, merchantId }) {
  const ref = orderId.slice(0, 8).toUpperCase()
  return `https://pay.wave.com/m/${merchantId || import.meta.env.VITE_WAVE_MERCHANT_ID}?amount=${amount}&ref=${ref}`
}

// Génère le lien Orange Money
export function getOrangeMoneyLink({ amount, orderId }) {
  const ref = orderId.slice(0, 8).toUpperCase()
  return `https://payment.orange.sn/pay?merchant=${import.meta.env.VITE_ORANGE_MERCHANT_CODE}&amount=${amount}&ref=${ref}`
}

// Génère le message WhatsApp de confirmation commande
export function getWhatsAppOrderMessage({ order, items }) {
  const itemsList = items
    .map(i => `• ${i.product_name} x${i.quantity} — ${i.subtotal.toLocaleString()} FCFA`)
    .join('\n')

  const message = `
🛍️ *Nouvelle commande ${order.order_number}*

👤 *Client :* ${order.customer_name}
📞 *Téléphone :* ${order.customer_phone}
📍 *Adresse :* ${order.delivery_address?.address}, ${order.delivery_address?.zone}

📦 *Articles :*
${itemsList}

💰 *Sous-total :* ${order.subtotal.toLocaleString()} FCFA
🚚 *Livraison :* ${order.delivery_fee.toLocaleString()} FCFA
✅ *Total :* ${order.total_amount.toLocaleString()} FCFA

💳 *Paiement :* ${order.payment_method.toUpperCase()}
  `.trim()

  return encodeURIComponent(message)
}