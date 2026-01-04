import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const SUPABASE_URL = 'https://kekoxnnqnicsscaovmwy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtla294bm5xbmljc3NjYW92bXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NDE1MTUsImV4cCI6MjA4MzExNzUxNX0._KJXmVDSpAqgq2_i1LIoLZ9HYAvNuZlUOGsfmCqDze4';

// Initialize Supabase client with React Native storage
let supabase = null;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
} catch (error) {
  console.warn('Supabase not configured yet:', error.message);
  supabase = null;
}
export { supabase };

// Storage bucket names
export const STORAGE_BUCKETS = {
  profileImages: 'profile-images',
  documents: 'documents',
  receipts: 'receipts',
};

// Helper function to upload profile image to Supabase Storage
export const uploadProfileImageToSupabase = async (uid, imageUri) => {
  try {
    // Check if Supabase is configured
    const isConfigured = supabase && SUPABASE_URL.includes('supabase.co') && !SUPABASE_ANON_KEY.includes('YOUR_');

    if (!isConfigured) {
      console.warn('⚠️ Supabase not configured. Saving image URI locally for now.');
      return imageUri;
    }

    if (!imageUri) {
      throw new Error('Image URI is required');
    }

    const timestamp = Date.now();
    const fileName = `profile_${uid}_${timestamp}.jpg`;
    const filePath = `${uid}/${fileName}`;

    console.log('Starting Supabase upload to path:', filePath);

    // Fetch the image and convert to ArrayBuffer (works better in React Native)
    const response = await fetch(imageUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Invalid image data received');
    }

    console.log('ArrayBuffer created, size:', arrayBuffer.byteLength, 'bytes');

    // Convert ArrayBuffer to Uint8Array for upload
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.profileImages)
      .upload(filePath, uint8Array, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    console.log('File uploaded successfully:', data);

    // Get public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKETS.profileImages)
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;
    console.log('Public URL obtained:', publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading profile image to Supabase:', error);
    throw error;
  }
};

// Helper function to delete old profile image
export const deleteProfileImageFromSupabase = async (uid, oldImageUrl) => {
  try {
    if (!oldImageUrl) return;

    const isConfigured = supabase && SUPABASE_URL.includes('supabase.co') && !SUPABASE_ANON_KEY.includes('YOUR_');
    
    if (!isConfigured) {
      console.warn('⚠️ Supabase not configured, skipping image deletion');
      return;
    }

    // Extract file path from URL
    const urlParts = oldImageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `${uid}/${fileName}`;

    console.log('Deleting old image from path:', filePath);

    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.profileImages)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting old image:', error);
      // Don't throw, just log the error
    } else {
      console.log('Old image deleted successfully');
    }
  } catch (error) {
    console.error('Error in deleteProfileImageFromSupabase:', error);
    // Don't throw, just log
  }
};

export default supabase;
