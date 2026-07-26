export interface AuthenticatedUser {
  token?: string | null;
}

export interface BackendLoginUser {
  id: string;
  name?: string | null;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  image?: string | null;
  role?: string | null;
}

export interface CurrentUser {
  id: string;
  name?: string | null;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  image?: string | null;
  role?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
}

export function getAuthToken(user?: AuthenticatedUser | null) {
  return user?.token ?? undefined;
}

export function buildAuthHeaders(token?: string) {
  const headers = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

export async function login(data: { email: string; password: string }) {
  const { request } = await import("./request");

  return request<{ token: string; user: BackendLoginUser }>("/api/login", {
    method: "POST",
    body: data,
  });
}

export async function register(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const { request } = await import("./request");

  return request<{
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
      role: string;
    };
    message?: string;
  }>("/api/register", {
    method: "POST",
    body: data,
  });
}

export async function getCurrentUser(token?: string) {
  const { request } = await import("./request");

  return request<CurrentUser>("/api/me", {
    token,
  });
}

export async function updateCurrentUser(
  data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  },
  token?: string
) {
  const { request } = await import("./request");

  return request<CurrentUser>("/api/me", {
    method: "PATCH",
    body: data,
    token,
  });
}
