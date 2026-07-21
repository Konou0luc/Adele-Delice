import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { login as loginRequest } from '@/lib/auth';

function splitName(name?: string | null) {
  const cleaned = (name ?? '').trim();

  if (!cleaned) {
    return { firstName: '', lastName: '' };
  }

  const parts = cleaned.split(/\s+/);
  const firstName = parts.shift() ?? '';
  const lastName = parts.join(' ');

  return { firstName, lastName };
}

const googleProvider =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    : null;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (
            typeof credentials?.email !== 'string' ||
            typeof credentials?.password !== 'string'
          ) {
            return null;
          }

          const data = await loginRequest({
            email: credentials.email,
            password: credentials.password,
          }).catch(() => null);

          if (data && data.user) {
            return {
              id: data.user.id,
              name:
                data.user.name || `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim(),
              email: data.user.email,
              role: data.user.role,
              image: data.user.image,
              token: data.token,
            };
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
    ...(googleProvider ? [googleProvider] : []),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        const normalizedRole = (user as any).role ?? 'USER';
        token.role = normalizedRole;
        token.token = (user as any).token;
        token.id = (user as any).id;
        token.picture = (user as any).image ?? token.picture;
        token.name = (user as any).name ?? token.name;
        token.email = (user as any).email ?? token.email;
      }

      if (account?.provider === 'google') {
        const fullName =
          (profile as { name?: string | null } | undefined)?.name ?? token.name ?? token.email ?? '';

        token.role = 'USER';
        token.id = token.id ?? account.providerAccountId;
        token.name = fullName;
        token.email = token.email ?? (profile as { email?: string | null } | undefined)?.email ?? undefined;
        token.picture = token.picture ?? (profile as { picture?: string | null } | undefined)?.picture ?? undefined;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role ?? 'USER';
        (session.user as any).token = token.token;
        (session.user as any).id = token.id;
        (session.user as any).name = token.name ?? session.user.name;
        (session.user as any).email = token.email ?? session.user.email;
        (session.user as any).image = token.picture ?? session.user.image;
      }

      return session;
    },
  },
});
