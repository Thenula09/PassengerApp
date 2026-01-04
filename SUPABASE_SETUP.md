# Supabase Integration Guide - Profile Picture Storage

## Overview
This guide explains how to set up Supabase for profile picture storage in the PassengerApp.

## Prerequisites
- Supabase project account (https://supabase.com)
- Firebase Realtime Database (for user data storage)
- React Native project with Expo or React Native CLI

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Create a new project
3. Note your project credentials:
   - **Project URL**: `https://YOUR_PROJECT_REF.supabase.co`
   - **Anon Key**: Found in Settings → API → Project API keys

## Step 2: Set Up Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Create a new bucket named: `profile-images`
3. Configure bucket policies:

   **Select bucket → Policies → New Policy**
   
   ```sql
   -- Allow users to upload their own profile images
   CREATE POLICY "Users can upload own profile images"
   ON storage.objects
   FOR INSERT
   WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

   -- Allow public access to profile images
   CREATE POLICY "Profile images are publicly accessible"
   ON storage.objects
   FOR SELECT
   USING (bucket_id = 'profile-images');

   -- Allow users to delete their own images
   CREATE POLICY "Users can delete own profile images"
   ON storage.objects
   FOR DELETE
   WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
   ```

## Step 3: Install Supabase Package

```bash
npm install @supabase/supabase-js
# or
yarn add @supabase/supabase-js
```

## Step 4: Update SupabaseConfig.js

Open `src/SupabaseConfig.js` and replace with your credentials:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

Example:
```javascript
const SUPABASE_URL = 'https://abc123xyz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## Step 5: How It Works

### Profile Picture Upload Flow:

1. **UserProfileScreen.jsx**
   - User taps camera icon
   - Opens image picker
   - Converts image to blob
   - Uploads to Supabase Storage (`profile-images/{uid}/profile_{uid}_{timestamp}.jpg`)
   - Gets public URL
   - Saves URL to Firebase Realtime Database `/passenger/{uid}/profileImage`
   - Caches URL locally on device

2. **EditUserProfileScreen.jsx**
   - User selects image
   - When saving, uploads to Supabase Storage
   - Deletes old image from Supabase
   - Updates Firebase database
   - Caches new URL locally

### Storage Path Structure:
```
Supabase Storage:
└── profile-images/
    └── {userId}/
        ├── profile_user123_1234567890.jpg
        ├── profile_user123_1234567891.jpg
        └── ... (old images can be deleted)

Firebase Realtime Database:
└── /passenger/{userId}/
    ├── profileImage: "https://abc123.supabase.co/storage/v1/object/public/profile-images/..."
    ├── profileImageUpdatedAt: "2024-01-04T10:30:00.000Z"
    └── ... (other user data)

Device Cache (AsyncStorage):
└── profileImage_{userId}: "https://abc123.supabase.co/storage/v1/object/public/profile-images/..."
```

## Step 6: Environment Variables (Optional)

For better security, use environment variables:

1. Create `.env` file in project root:
```
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

2. Install `react-native-dotenv`:
```bash
npm install react-native-dotenv
```

3. Update `SupabaseConfig.js`:
```javascript
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
```

## Step 7: Features & Benefits

✅ **Advantages:**
- Separate storage service (cleaner architecture)
- PostgreSQL database integration available
- Realtime subscriptions
- Built-in authentication
- Row Level Security (RLS)
- No Firebase storage costs
- Open-source alternative

✅ **Current Implementation:**
- Profile images stored in Supabase Storage
- User data still in Firebase Realtime Database
- Local device caching for offline access
- Automatic old image deletion
- Public image URLs for display

## Step 8: Troubleshooting

### Issue: "Bucket not found"
- Verify bucket name is exactly `profile-images`
- Check bucket is not private

### Issue: "Invalid credentials"
- Double-check SUPABASE_URL and SUPABASE_ANON_KEY
- Ensure no trailing spaces in credentials

### Issue: "Upload fails"
- Check storage RLS policies are correct
- Verify bucket allows INSERT and SELECT operations
- Check image file size (max 100MB per file)

### Issue: "Cannot get public URL"
- Ensure bucket is public
- Check file path in storage is correct

## Step 9: Monitoring & Analytics

### View uploaded images:
1. Supabase Dashboard → Storage → profile-images
2. See all uploaded profile pictures
3. Monitor storage usage

### Check image URLs:
1. Firebase Database → /passenger/{userId}/profileImage
2. Open URL in browser to verify accessibility

## Step 10: Future Enhancements

- [ ] Image compression before upload
- [ ] Thumbnail generation
- [ ] Batch operations
- [ ] Image analytics
- [ ] CDN integration
- [ ] Backup automation

## API Reference

### uploadProfileImageToSupabase(uid, imageUri)
```javascript
const imageUrl = await uploadProfileImageToSupabase('user123', 'file:///path/to/image.jpg');
```

**Returns:** Public image URL

**Throws:** Error if upload fails

### deleteProfileImageFromSupabase(uid, imageUrl)
```javascript
await deleteProfileImageFromSupabase('user123', 'https://...');
```

**Returns:** void (silently handles errors)

## Support

For more information:
- Supabase Docs: https://supabase.com/docs
- Storage Guide: https://supabase.com/docs/guides/storage
- RLS Policies: https://supabase.com/docs/guides/auth/row-level-security
