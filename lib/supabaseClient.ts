import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://jdnmalwkhgqxlqeyahhy.supabase.co/"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkbm1hbHdraGdxeGxxZXlhaGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MDM4MTUsImV4cCI6MjA2NTQ3OTgxNX0.ermWpznfAgScPKHEhJ0SifsQFYfQ_-i7mjxlbY4Ylyw"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,},
    })