export { login } from "./auth";
import { request } from "./request";

interface QueryValue {
  [key: string]: string | number | boolean | undefined;
}

function withQuery(
  endpoint: string,
  params?: QueryValue
) {
  if (!params) {
    return endpoint;
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `${endpoint}?${queryString}` : endpoint;
}

export interface UploadImageResponse {
  success: boolean;
  url: string;
  publicId: string;
}

export interface MenuPayload {
  name: string;
  description?: string;
  type: keyof MenuType;
  date?: string;
  dayOfWeek?: number;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  isActive?: boolean;
  menuItems?: {
    dishId: string;
    price?: number;
    quantity?: number;
  }[];
}

export const uploadImage = async (
  file: File,
  token?: string
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  return request<UploadImageResponse>("/api/upload", {
    method: "POST",
    body: formData,
    token,
  });
};

// --- API Functions ---

// Categories
export const getCategories = () => apiFetch<Category[]>("/api/categories");
export const getCategory = (id: string) => apiFetch<Category>(`/api/categories/${id}`);
export const createCategory = (data: Partial<Category>, token?: string) =>
  apiFetch<Category>("/api/categories", { method: "POST", body: data, token });
export const updateCategory = (id: string, data: Partial<Category>, token?: string) =>
  apiFetch<Category>(`/api/categories/${id}`, { method: "PUT", body: data, token });
export const deleteCategory = (id: string, token?: string) =>
  apiFetch<void>(`/api/categories/${id}`, { method: "DELETE", token });

// Dishes
export const getDishes = (params?: {
  categoryId?: string;
  isPromoted?: boolean;
  isNew?: boolean;
}) => apiFetch<Dish[]>(withQuery("/api/dishes", params));
export const createDish = (data: Partial<Dish>, token?: string) =>
  apiFetch<Dish>("/api/dishes", { method: "POST", body: data, token });
export const updateDish = (id: string, data: Partial<Dish>, token?: string) =>
  apiFetch<Dish>(`/api/dishes/${id}`, { method: "PUT", body: data, token });
export const deleteDish = (id: string, token?: string) =>
  apiFetch<void>(`/api/dishes/${id}`, { method: "DELETE", token });
export const getDish = (id: string) => apiFetch<Dish>(`/api/dishes/${id}`);

// Menus
export const getMenus = (params?: {
  type?: "DAILY" | "WEEKLY" | "SPECIAL";
  includeInactive?: boolean;
}, token?: string) =>
  apiFetch<Menu[]>(withQuery("/api/menus", params), { token });
export const createMenu = (data: MenuPayload, token?: string) =>
  apiFetch<Menu>("/api/menus", { method: "POST", body: data, token });
export const updateMenu = (id: string, data: MenuPayload, token?: string) =>
  apiFetch<Menu>(`/api/menus/${id}`, { method: "PUT", body: data, token });
export const deleteMenu = (id: string, token?: string) =>
  apiFetch<void>(`/api/menus/${id}`, { method: "DELETE", token });
export const getMenu = (id: string, token?: string) =>
  apiFetch<Menu>(`/api/menus/${id}`, { token });

// Gallery
export const getGalleryItems = (params?: { category?: string }) =>
  apiFetch<GalleryItem[]>(withQuery("/api/gallery-items", params));
export const getGalleryItem = (id: string) => apiFetch<GalleryItem>(`/api/gallery-items/${id}`);
export const createGalleryItem = (data: Partial<GalleryItem>, token?: string) =>
  apiFetch<GalleryItem>("/api/gallery-items", { method: "POST", body: data, token });
export const updateGalleryItem = (id: string, data: Partial<GalleryItem>, token?: string) =>
  apiFetch<GalleryItem>(`/api/gallery-items/${id}`, { method: "PUT", body: data, token });
export const deleteGalleryItem = (id: string, token?: string) =>
  apiFetch<void>(`/api/gallery-items/${id}`, { method: "DELETE", token });

// Orders
export const getOrders = (
  params?: { orderNumber?: string },
  token?: string
) => apiFetch<Order[]>(withQuery("/api/orders", params), { token });
export const createOrder = (data: CreateOrderPayload) =>
  apiFetch<Order>("/api/orders", { method: "POST", body: data });
export const updateOrder = (id: string, data: Partial<Order>, token?: string) =>
  apiFetch<Order>(`/api/orders/${id}`, { method: "PUT", body: data, token });
export const getOrder = (id: string, token?: string) =>
  apiFetch<Order>(`/api/orders/${id}`, { token });

export const getTrackedOrder = async (code: string): Promise<Order> => {
  const res = await fetch(`/api/track-order?code=${encodeURIComponent(code)}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(errorData.message || "Commande introuvable", res.status, errorData);
  }
  return res.json();
};

export interface PaymentMethod {
  YAS_MONEY: "YAS_MONEY";
  MOOV_MONEY: "MOOV_MONEY";
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: keyof PaymentMethod;
  status: "PENDING" | "SUCCESS" | "FAILED";
  fedaPayReference?: string | null;
  createdAt: string;
  updatedAt: string;
  order?: Order;
}

export interface CreatePaymentPayload {
  orderId: string;
  amount: number;
  method: keyof PaymentMethod;
}

export const createPayment = (data: CreatePaymentPayload, token?: string) =>
  apiFetch<{ payment: Payment; paymentUrl?: string | null }>("/api/payments", {
    method: "POST",
    body: data,
    token,
  });

// Reservations
export const getReservations = (token?: string) =>
  apiFetch<Reservation[]>("/api/reservations", { token });
export const getReservation = (id: string, token?: string) =>
  apiFetch<Reservation>(`/api/reservations/${id}`, { token });
export const createReservation = (data: Partial<Reservation>) =>
  apiFetch<Reservation>("/api/reservations", { method: "POST", body: data });
export const updateReservation = (id: string, data: Partial<Reservation>, token?: string) =>
  apiFetch<Reservation>(`/api/reservations/${id}`, { method: "PUT", body: data, token });
export const deleteReservation = (id: string, token?: string) =>
  apiFetch<void>(`/api/reservations/${id}`, { method: "DELETE", token });

function apiFetch<T>(
  endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string;
  }
) {
  return request<T>(endpoint, options);
}

// --- Types ---

export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  image?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  order?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Dish {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  images: string[];
  isAvailable: boolean;
  preparationTime?: number;
  spiceLevel?: number;
  allergens: string[];
  isPromoted: boolean;
  isNew: boolean;
  orderCount: number;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuType {
  DAILY: "DAILY";
  WEEKLY: "WEEKLY";
  SPECIAL: "SPECIAL";
}

export interface MenuItem {
  id: string;
  menuId: string;
  dishId: string;
  price?: number;
  quantity?: number;
  dish?: Dish;
}

export interface Menu {
  id: string;
  name: string;
  description?: string;
  type: keyof MenuType;
  date?: string;
  dayOfWeek?: number;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  isActive: boolean;
  menuItems?: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title?: string;
  category?: string;
  isActive: boolean;
  order?: number;
  createdAt: string;
}

export interface OrderStatus {
  PENDING: "PENDING";
  PAYMENT_CONFIRMED: "PAYMENT_CONFIRMED";
  PREPARING: "PREPARING";
  READY: "READY";
  DELIVERING: "DELIVERING";
  DELIVERED: "DELIVERED";
  CANCELLED: "CANCELLED";
}

export interface OrderItem {
  id: string;
  orderId: string;
  dishId: string;
  quantity: number;
  unitPrice: number;
  dish?: Dish;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  comment?: string;
  orderType: string;
  totalAmount: number;
  status: keyof OrderStatus;
  orderItems?: OrderItem[];
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  comment?: string;
  orderType: string;
  totalAmount: number;
  orderItems: {
    dishId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface ReservationStatus {
  PENDING: "PENDING";
  CONFIRMED: "CONFIRMED";
  RESCHEDULED: "RESCHEDULED";
  CANCELLED: "CANCELLED";
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  numberOfPeople: number;
  comment?: string;
  status: keyof ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

// Users API
export const getUsers = (token?: string) =>
  apiFetch<User[]>('/api/users', { token });
export const getUser = (id: string, token?: string) =>
  apiFetch<User>(`/api/users/${id}`, { token });
export const createUser = (data: Partial<User>, token?: string) =>
  apiFetch<User>('/api/users', { method: 'POST', body: data, token });
export const updateUser = (id: string, data: Partial<User>, token?: string) =>
  apiFetch<User>(`/api/users/${id}`, { method: 'PUT', body: data, token });
export const deleteUser = (id: string, token?: string) =>
  apiFetch<void>(`/api/users/${id}`, { method: 'DELETE', token });

// Reviews API
export interface Review {
  id: string;
  name: string;
  rating: number;
  comment?: string;
  isApproved: boolean;
  dishId?: string;
  dish?: Dish;
  createdAt: string;
}

export const getReviews = (params?: { dishId?: string; isApproved?: boolean }, token?: string) =>
  apiFetch<Review[]>(withQuery('/api/reviews', params), { token });
export const createReview = (data: Partial<Review>) =>
  apiFetch<Review>('/api/reviews', { method: 'POST', body: data });
export const updateReview = (id: string, data: Partial<Review>, token?: string) =>
  apiFetch<Review>(`/api/reviews/${id}`, { method: 'PUT', body: data, token });
export const deleteReview = (id: string, token?: string) =>
  apiFetch<void>(`/api/reviews/${id}`, { method: 'DELETE', token });

// Promotions API
export interface Promotion {
  id: string;
  name: string;
  description?: string;
  percentage?: number;
  fixedAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  dishId?: string;
  dish?: Dish;
  createdAt: string;
  updatedAt: string;
}

export const getPromotions = (token?: string) =>
  apiFetch<Promotion[]>('/api/promotions', { token });
export const createPromotion = (data: Partial<Promotion>, token?: string) =>
  apiFetch<Promotion>('/api/promotions', { method: 'POST', body: data, token });
export const updatePromotion = (id: string, data: Partial<Promotion>, token?: string) =>
  apiFetch<Promotion>(`/api/promotions/${id}`, { method: 'PUT', body: data, token });
export const deletePromotion = (id: string, token?: string) =>
  apiFetch<void>(`/api/promotions/${id}`, { method: 'DELETE', token });

// Blog Posts API
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getBlogPosts = (params?: { isPublished?: boolean }) =>
  apiFetch<BlogPost[]>(withQuery('/api/blog-posts', params));
export const getBlogPost = (id: string) =>
  apiFetch<BlogPost>(`/api/blog-posts/${id}`);
export const createBlogPost = (data: Partial<BlogPost>, token?: string) =>
  apiFetch<BlogPost>('/api/blog-posts', { method: 'POST', body: data, token });
export const updateBlogPost = (id: string, data: Partial<BlogPost>, token?: string) =>
  apiFetch<BlogPost>(`/api/blog-posts/${id}`, { method: 'PUT', body: data, token });
export const deleteBlogPost = (id: string, token?: string) =>
  apiFetch<void>(`/api/blog-posts/${id}`, { method: 'DELETE', token });

// Site Content API
export const getSiteContent = () =>
  apiFetch<Record<string, string>>('/api/site-content');
export const updateSiteContent = (data: Record<string, string>, token?: string) =>
  apiFetch<Record<string, string>>('/api/site-content', { method: 'PUT', body: data, token });

