// Súbor: src/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

// 1. Získanie premenných prostredia. 
// Keďže ide o moderný front-end, používame 'import.meta.env'.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Ochranná podmienka pre prípad, že kľúče chýbajú
  throw new Error('Chýbajú premenné prostredia SUPABASE_URL alebo SUPABASE_ANON_KEY!')
}

// 2. Inicializácia klienta.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Túto inštanciu 'supabase' budete teraz importovať všade, kde ju potrebujete.