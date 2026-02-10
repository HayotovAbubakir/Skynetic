// src/lib/supabase.ts  (yoki qayerda saqlamoqchi bo'lsang)

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ENV qiymatlarni olish
const supabaseUrl: string | undefined = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY

// Guard — noto'g'ri configni darhol ushlaydi
if (!supabaseUrl) {
  throw new Error(
    'VITE_SUPABASE_URL topilmadi. .env faylni tekshir va dev serverni restart qil.'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    'VITE_SUPABASE_ANON_KEY topilmadi. .env faylni tekshir va dev serverni restart qil.'
  )
}

// Client yaratish
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)
