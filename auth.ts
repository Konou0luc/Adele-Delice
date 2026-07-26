import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { createApiToken } from '@/lib/api-token';
import { login as loginRequest } from '@/lib/auth';

type AuthRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

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

function buildSessionToken(input: {
  id: string;
  role: AuthRole;
  email: string;
  firstName: string;
  lastName: string;
}) {
  return createApiToken({
    sub: input.id,
    role: input.role,
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
  });
}

function resolveProfileName(name?: string | null) {
  const { firstName, lastName } = splitName(name);

  return {
    name: (name ?? '').trim(),
    firstName,
    lastName,
  };
}

const googleProvider = {
  id: 'google',
  name: 'Google',
  type: 'oauth',
  issuer: 'https://accounts.google.com',
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authorization: {
    url: 'https://accounts.google.com/o/oauth2/v2/auth',
    params: {
      scope: 'openid profile email',
      prompt: 'consent',
      access_type: 'offline',
      response_type: 'code',
    },
  },
  token: 'https://oauth2.googleapis.com/token',
  userinfo: 'https://openidconnect.googleapis.com/v1/userinfo',
  profile(profile: { sub?: string; name?: string; email?: string; picture?: string }) {
    return {
      id: profile.sub ?? '',
      name: profile.name ?? '',
      email: profile.email ?? '',
      image: profile.picture ?? '',
    };
  },
  style: {
    brandColor: '#1a73e8',
  },
} as const;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    googleProvider as any,
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

          if (!data?.user) {
            return null;
          }

          const resolvedName =
            data.user.name || `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim();
          const { firstName, lastName } = splitName(resolvedName);
          const role = (data.user.role as AuthRole | null | undefined) ?? 'EMPLOYEE';

          return {
            id: data.user.id,
            name: resolvedName,
            email: data.user.email,
            role,
            image: data.user.image,
            firstName: data.user.firstName ?? firstName,
            lastName: data.user.lastName ?? lastName,
            token:
              data.token ||
              buildSessionToken({
                id: data.user.id,
                role,
                email: data.user.email,
                firstName: data.user.firstName ?? firstName,
                lastName: data.user.lastName ?? lastName,
              }),
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const jwtToken = token as any;

      if (user) {
        const authUser = user as any;
        const firstName = authUser.firstName ?? splitName(user.name).firstName;
        const lastName = authUser.lastName ?? splitName(user.name).lastName;
        const email = user.email ?? '';
        const name = user.name ?? `${firstName} ${lastName}`.trim();
        const role = (authUser.role as AuthRole | undefined) ?? 'EMPLOYEE';

        jwtToken.id = user.id;
        jwtToken.role = role;
        jwtToken.firstName = firstName;
        jwtToken.lastName = lastName;
        jwtToken.name = name;
        jwtToken.email = email;
        jwtToken.picture = user.image ?? '';
        jwtToken.token =
          authUser.token ??
          buildSessionToken({
            id: user.id ?? 'google-user',
            role,
            email,
            firstName,
            lastName,
          });
      }

      if (trigger === 'update' && session) {
        const sessionUpdate = session as any;
        const updatedFirstName =
          typeof sessionUpdate.firstName === 'string'
            ? sessionUpdate.firstName
            : typeof sessionUpdate.user?.firstName === 'string'
              ? sessionUpdate.user.firstName
              : jwtToken.firstName ?? '';
        const updatedLastName =
          typeof sessionUpdate.lastName === 'string'
            ? sessionUpdate.lastName
            : typeof sessionUpdate.user?.lastName === 'string'
              ? sessionUpdate.user.lastName
              : jwtToken.lastName ?? '';
        const updatedName =
          typeof sessionUpdate.name === 'string'
            ? sessionUpdate.name
            : typeof sessionUpdate.user?.name === 'string'
              ? sessionUpdate.user.name
              : `${updatedFirstName} ${updatedLastName}`.trim();
        const updatedEmail =
          typeof sessionUpdate.email === 'string'
            ? sessionUpdate.email
            : typeof sessionUpdate.user?.email === 'string'
              ? sessionUpdate.user.email
              : jwtToken.email ?? '';
        const updatedImage =
          typeof sessionUpdate.image === 'string'
            ? sessionUpdate.image
            : typeof sessionUpdate.user?.image === 'string'
              ? sessionUpdate.user.image
              : jwtToken.picture ?? '';
        const updatedRole =
          typeof sessionUpdate.role === 'string'
            ? sessionUpdate.role
            : typeof sessionUpdate.user?.role === 'string'
              ? sessionUpdate.user.role
              : jwtToken.role ?? 'EMPLOYEE';

        jwtToken.firstName = updatedFirstName;
        jwtToken.lastName = updatedLastName;
        jwtToken.name = updatedName;
        jwtToken.email = updatedEmail;
        jwtToken.picture = updatedImage;
        jwtToken.role = updatedRole;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as any;
        const jwtToken = token as any;
        sessionUser.role = jwtToken.role ?? 'EMPLOYEE';
        sessionUser.token = jwtToken.token;
        sessionUser.id = jwtToken.id;
        sessionUser.firstName = jwtToken.firstName ?? '';
        sessionUser.lastName = jwtToken.lastName ?? '';
        sessionUser.name = jwtToken.name ?? session.user.name;
        sessionUser.email = jwtToken.email ?? session.user.email;
        sessionUser.image = jwtToken.picture ?? session.user.image;
      }

      return session;
    },
  },
});
