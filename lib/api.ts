const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: Record<string, any>;
  token?: string;
}

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const config: RequestInit = {
    method: options.method || "GET",
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: "Une erreur est survenue",
      }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

// Upload
export const uploadImage = async (file: File, token?: string): Promise<{ success: boolean; url: string; publicId: string }> => {
  const url = `${API_BASE_URL}/api/upload`;
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "Une erreur est survenue lors de l'upload",
    }));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return await response.json();
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
}) => {
  const searchParams = new URLSearchParams();
  if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params?.isPromoted !== undefined)
    searchParams.set("isPromoted", String(params.isPromoted));
  if (params?.isNew !== undefined)
    searchParams.set("isNew", String(params.isNew));

  const queryString = searchParams.toString();
  return apiFetch<Dish[]>(`/api/dishes${queryString ? `?${queryString}` : ""}`);
};
export const createDish = (data: Partial<Dish>, token?: string) =>
  apiFetch<Dish>("/api/dishes", { method: "POST", body: data, token });
export const updateDish = (id: string, data: Partial<Dish>, token?: string) =>
  apiFetch<Dish>(`/api/dishes/${id}`, { method: "PUT", body: data, token });
export const deleteDish = (id: string, token?: string) =>
  apiFetch<void>(`/api/dishes/${id}`, { method: "DELETE", token });
export const getDish = (id: string) => apiFetch<Dish>(`/api/dishes/${id}`);

// Menus
export const getMenus = (params?: { type?: "DAILY" | "WEEKLY" | "SPECIAL" }) => {
  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.set("type", params.type);

  const queryString = searchParams.toString();
  return apiFetch<Menu[]>(`/api/menus${queryString ? `?${queryString}` : ""}`);
};
export const createMenu = (data: Partial<Menu>, token?: string) =>
  apiFetch<Menu>("/api/menus", { method: "POST", body: data, token });
export const updateMenu = (id: string, data: Partial<Menu>, token?: string) =>
  apiFetch<Menu>(`/api/menus/${id}`, { method: "PUT", body: data, token });
export const deleteMenu = (id: string, token?: string) =>
  apiFetch<void>(`/api/menus/${id}`, { method: "DELETE", token });
export const getMenu = (id: string) => apiFetch<Menu>(`/api/menus/${id}`);

// Gallery
export const getGalleryItems = (params?: { category?: string }) => {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);

  const queryString = searchParams.toString();
  return apiFetch<GalleryItem[]>(
    `/api/gallery-items${queryString ? `?${queryString}` : ""}`
  );
};
export const getGalleryItem = (id: string) => apiFetch<GalleryItem>(`/api/gallery-items/${id}`);
export const createGalleryItem = (data: Partial<GalleryItem>, token?: string) =>
  apiFetch<GalleryItem>("/api/gallery-items", { method: "POST", body: data, token });
export const updateGalleryItem = (id: string, data: Partial<GalleryItem>, token?: string) =>
  apiFetch<GalleryItem>(`/api/gallery-items/${id}`, { method: "PUT", body: data, token });
export const deleteGalleryItem = (id: string, token?: string) =>
  apiFetch<void>(`/api/gallery-items/${id}`, { method: "DELETE", token });

// Orders
export const getOrders = (params?: { orderNumber?: string }) => {
  const searchParams = new URLSearchParams();
  if (params?.orderNumber) searchParams.set("orderNumber", params.orderNumber);
  const queryString = searchParams.toString();
  return apiFetch<Order[]>(`/api/orders${queryString ? `?${queryString}` : ""}`);
};
export const createOrder = (data: CreateOrderPayload) =>
  apiFetch<Order>("/api/orders", { method: "POST", body: data });
export const updateOrder = (id: string, data: Partial<Order>, token?: string) =>
  apiFetch<Order>(`/api/orders/${id}`, { method: "PUT", body: data, token });
export const getOrder = (id: string) => apiFetch<Order>(`/api/orders/${id}`);

// Reservations
export const getReservations = () => apiFetch<Reservation[]>("/api/reservations");
export const createReservation = (data: Partial<Reservation>) =>
  apiFetch<Reservation>("/api/reservations", { method: "POST", body: data });
export const updateReservation = (id: string, data: Partial<Reservation>, token?: string) =>
  apiFetch<Reservation>(`/api/reservations/${id}`, { method: "PUT", body: data, token });

// Auth
export const login = (data: { email: string; password: string }) =>
  apiFetch<{ token: string; user: User }>("/api/login", {
    method: "POST",
    body: data,
  });

// --- Types ---

export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  comment?: string;
  orderType: string;
  orderItems: {
    dishId: string;
    quantity: number;
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
