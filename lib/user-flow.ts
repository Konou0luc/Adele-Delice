export interface CartItem {
  dishId: string
  name: string
  price: number
  quantity: number
  image?: string
  categoryName?: string
  preparationTime?: number
}

export interface OrderHistoryEntry {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  orderType: string
  totalAmount: number
  status: string
  deliveryAddress?: string
  comment?: string
  paymentMethod?: string
  paymentUrl?: string
  createdAt: string
  items: CartItem[]
}

const CART_KEY = 'adele-delice:cart'
const ORDERS_KEY = 'adele-delice:orders'
const CART_UPDATED_EVENT = 'adele-delice:cart-updated'

function canUseStorage() {
  return typeof window !== 'undefined'
}

function readJson<T>(key: string, fallback: T) {
  if (!canUseStorage()) {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) {
      return fallback
    }

    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))

  if (key === CART_KEY) {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT))
  }
}

export function getCartItems() {
  return readJson<CartItem[]>(CART_KEY, [])
}

export function setCartItems(items: CartItem[]) {
  writeJson(CART_KEY, items)
}

export function addCartItem(item: Omit<CartItem, 'quantity'>, quantity = 1) {
  const cart = getCartItems()
  const existingIndex = cart.findIndex((entry) => entry.dishId === item.dishId)

  if (existingIndex >= 0) {
    cart[existingIndex] = {
      ...cart[existingIndex],
      quantity: cart[existingIndex].quantity + quantity,
    }
  } else {
    cart.push({ ...item, quantity })
  }

  setCartItems(cart)
  return cart
}

export function updateCartQuantity(dishId: string, quantity: number) {
  const cart = getCartItems()
    .map((item) => (item.dishId === dishId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0)

  setCartItems(cart)
  return cart
}

export function removeCartItem(dishId: string) {
  const cart = getCartItems().filter((item) => item.dishId !== dishId)
  setCartItems(cart)
  return cart
}

export function clearCart() {
  setCartItems([])
}

export function getCartTotal(items = getCartItems()) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

export function getOrderHistory() {
  return readJson<OrderHistoryEntry[]>(ORDERS_KEY, [])
}

export function addOrderHistory(entry: OrderHistoryEntry) {
  const orders = getOrderHistory()
  const nextOrders = [entry, ...orders]
  writeJson(ORDERS_KEY, nextOrders)
  return nextOrders
}

export function getOrderHistoryItem(id: string) {
  return getOrderHistory().find((order) => order.id === id)
}

export const cartUpdatedEventName = CART_UPDATED_EVENT
