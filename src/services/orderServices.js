import { supabase } from './supabase'

export async function createOrder({ customer, cart, deliveryZone, paymentMethod, channel = 'web' }) {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const deliveryFee = deliveryZone?.fee || 0
  const totalAmount = subtotal + deliveryFee

  // 1. Crée la commande
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: customer.full_name,
      customer_phone: customer.phone,
      customer_email: customer.email || null,
      customer_id: customer.id || null,
      delivery_address: {
        address: customer.address,
        city: deliveryZone?.city || '',
        zone: deliveryZone?.name || ''
      },
      delivery_zone_id: deliveryZone?.id || null,
      delivery_fee: deliveryFee,
      subtotal,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'cash' ? 'pending' : 'pending',
      channel,
      status: 'pending'
    })
    .select()
    .single()

  if (orderError) throw orderError

  // 2. Insère les articles
  const orderItems = cart.map(item => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name_fr,
    product_image: item.images?.[0] || null,
    quantity: item.quantity,
    unit_price: item.price,
    subtotal: item.price * item.quantity
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw itemsError

  // 3. Crée la transaction de paiement
  await supabase.from('payment_transactions').insert({
    order_id: order.id,
    provider: paymentMethod,
    amount: totalAmount,
    status: 'pending'
  })

  return order
}

export async function getOrderByNumber(orderNumber) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*),
      delivery_zone:delivery_zones(name, city, fee)
    `)
    .eq('order_number', orderNumber)
    .single()

  if (error) throw error
  return data
}