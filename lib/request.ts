import { buildAuthHeaders, getApiBaseUrl } from "./auth";
import { ApiError } from "./api-error";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type PrimitiveBody = BodyInit | null | undefined;

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
  headers?: HeadersInit;
}

function isBodyInit(value: RequestOptions["body"]): value is BodyInit {
  return (
    value instanceof FormData ||
    value instanceof URLSearchParams ||
    value instanceof Blob ||
    typeof value === "string" ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value)
  );
}

async function parseResponse(response: Response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

function getErrorMessage(data: unknown, fallback: string) {
  if (!data || typeof data !== "object") {
    return fallback;
  }

  const errorData = data as Record<string, unknown>;

  if (typeof errorData.erreur === "string") {
    return errorData.erreur;
  }

  if (typeof errorData.message === "string") {
    return errorData.message;
  }

  if (typeof errorData.error === "string") {
    return errorData.error;
  }

  return fallback;
}

export async function request<T>(
  endpoint: string,
  { method = "GET", body, token, headers }: RequestOptions = {}
): Promise<T> {
  const resolvedHeaders = new Headers(headers);
  const authHeaders = buildAuthHeaders(token);

  authHeaders.forEach((value, key) => {
    resolvedHeaders.set(key, value);
  });

  const init: RequestInit = {
    method,
    headers: resolvedHeaders,
  };

  if (body !== undefined && body !== null) {
    if (isBodyInit(body)) {
      init.body = body;
    } else {
      resolvedHeaders.set("Content-Type", "application/json");
      init.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${getApiBaseUrl()}${endpoint}`, init);
  const data = await parseResponse(response).catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, "Une erreur est survenue."),
      response.status,
      data
    );
  }

  return data as T;
}
