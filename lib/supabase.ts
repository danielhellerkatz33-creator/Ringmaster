import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Only create client if we have real configuration
export const supabase = supabaseUrl.includes('placeholder') ? null : createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          is_pro: boolean
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          is_pro?: boolean
          stripe_customer_id?: string | null
        }
        Update: {
          email?: string
          is_pro?: boolean
          stripe_customer_id?: string | null
        }
      }
      stripe_events: {
        Row: {
          id: string
          type: string
          processed: boolean
          created_at: string
        }
        Insert: {
          id: string
          type: string
          processed?: boolean
        }
        Update: {
          type?: string
          processed?: boolean
        }
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
