import { createClient } from '@supabase/supabase-js';

// Wstaw swoje dane z Supabase (URL i klucz publiczny)
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'public-anon-key';
export const supabase = createClient(supabaseUrl, supabaseKey);
