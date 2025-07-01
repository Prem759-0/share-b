import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') && 
  !supabaseUrl.includes('placeholder') &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey !== 'placeholder-key';

// Only create client if properly configured, otherwise use null
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const uploadFile = async (file: File, shareId: string) => {
  if (!supabase) {
    throw new Error('Supabase not configured. Please set up your Supabase project.');
  }

  const fileName = `${shareId}/${Date.now()}_${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('files')
    .upload(fileName, file);

  if (error) throw error;
  return data;
};

export const getFileUrl = (path: string) => {
  if (!supabase) {
    return '';
  }

  const { data } = supabase.storage
    .from('files')
    .getPublicUrl(path);
  
  return data.publicUrl;
};

export const downloadFile = async (path: string) => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase.storage
    .from('files')
    .download(path);

  if (error) throw error;
  return data;
};