// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sttmdnbpokacixnelqjd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0dG1kbmJwb2thY2l4bmVscWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyODAyNjYsImV4cCI6MjA1Njg1NjI2Nn0.O_8Z_yC0YRxiB6BT63r1YiiSj16DYtj4hTL-mJJ5tXc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);