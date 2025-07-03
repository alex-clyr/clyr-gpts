import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Environment variables
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Mock client for when Supabase is not configured
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }),
    signInWithPassword: () =>
      Promise.resolve({
        error: { message: "Authentication not available in demo mode. Please configure Supabase." },
      }),
    signUp: () =>
      Promise.resolve({
        error: { message: "Authentication not available in demo mode. Please configure Supabase." },
      }),
    signInWithOAuth: () =>
      Promise.resolve({
        error: { message: "Authentication not available in demo mode. Please configure Supabase." },
      }),
    signOut: () =>
      Promise.resolve({
        error: { message: "Authentication not available in demo mode. Please configure Supabase." },
      }),
  },
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        order: (column: string, options?: any) =>
          Promise.resolve({
            data: null,
            error: { message: "Database not available in demo mode. Please configure Supabase." },
          }),
        single: () =>
          Promise.resolve({
            data: null,
            error: { message: "Database not available in demo mode. Please configure Supabase." },
          }),
      }),
    }),
    insert: (data: any) =>
      Promise.resolve({
        error: { message: "Database not available in demo mode. Please configure Supabase." },
      }),
  }),
})

// Client-side Supabase client
export const createClient = () => {
  if (!isSupabaseConfigured) {
    return createMockClient() as any
  }
  return createClientComponentClient()
}

// Server-side Supabase client
export const createServerClient = () => {
  if (!isSupabaseConfigured) {
    return createMockClient() as any
  }
  return createServerComponentClient({ cookies })
}
