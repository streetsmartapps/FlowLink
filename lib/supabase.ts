import { createClient } from '@supabase/supabase-js';

// Connect to your own Supabase project.
const supabaseUrl = 'https://lprtesjmlpzqifbyrmsf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwcnRlc2ptbHB6cWlmYnlybXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTMwMTcsImV4cCI6MjA3NjAyOTAxN30.8apAFbfbT5eRdlwZaTzZC-PkRhIOLpmoHPLjvLhxv04';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);