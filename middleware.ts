import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token;
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isAdminLoginRoute = req.nextUrl.pathname === '/admin/login';

  if (isAdminRoute) {
    // Si c'est la page de login admin et qu'on est déjà connecté en staff
    if (isAdminLoginRoute) {
      if (isLoggedIn) {
        const role = (token as { role?: string })?.role;
        if (role === 'ADMIN' || role === 'MANAGER' || role === 'EMPLOYEE') {
          return NextResponse.redirect(new URL('/admin', req.nextUrl));
        }
      }
      return NextResponse.next();
    }

    // Si on veut accéder aux pages d'administration sans être connecté
    if (!isLoggedIn) {
      const loginUrl = new URL('/admin/login', req.nextUrl);
      loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Vérification des rôles autorisés (ADMIN, MANAGER, EMPLOYEE)
    const role = (token as { role?: string })?.role;
    const allowedRoles = ['ADMIN', 'MANAGER', 'EMPLOYEE'];

    if (!role || !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

