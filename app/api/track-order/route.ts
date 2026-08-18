import { NextRequest, NextResponse } from "next/server";
import { createApiToken } from "@/lib/api-token";
import { getApiBaseUrl } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code") || searchParams.get("orderNumber");

  if (!code || !code.trim()) {
    return NextResponse.json(
      { message: "Code de commande requis" },
      { status: 400 }
    );
  }

  const cleanCode = code.trim();

  try {
    const systemToken = createApiToken({
      sub: "system-order-tracker",
      role: "ADMIN",
      email: "system-tracker@adeledelice.com",
      firstName: "System",
      lastName: "Tracker",
    });

    const baseUrl = getApiBaseUrl();

    // 1. Try search by orderNumber
    const searchUrl = `${baseUrl}/api/orders?orderNumber=${encodeURIComponent(cleanCode)}`;
    const response = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${systemToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        // Return matching order or exact match
        const exactMatch = data.find(
          (o: any) =>
            o.orderNumber?.toUpperCase() === cleanCode.toUpperCase() ||
            o.id === cleanCode
        );
        return NextResponse.json(exactMatch || data[0]);
      } else if (data && !Array.isArray(data)) {
        return NextResponse.json(data);
      }
    }

    // 2. Try fetching by ID directly if not found via search
    const directUrl = `${baseUrl}/api/orders/${encodeURIComponent(cleanCode)}`;
    const directResponse = await fetch(directUrl, {
      headers: {
        Authorization: `Bearer ${systemToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (directResponse.ok) {
      const directData = await directResponse.json();
      if (directData && directData.id) {
        return NextResponse.json(directData);
      }
    }

    return NextResponse.json(
      { message: "Commande introuvable" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error tracking order:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération de la commande" },
      { status: 500 }
    );
  }
}
