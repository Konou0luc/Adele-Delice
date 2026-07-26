import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id?: string
      token?: string
      role?: string
      firstName?: string
      lastName?: string
    }
  }

  interface User {
    id: string
    token?: string
    role?: string
    firstName?: string
    lastName?: string
  }
}
