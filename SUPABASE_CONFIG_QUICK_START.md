# ⚡ Supabase Configuration - Quick Start

## Current Status
✅ **@supabase/supabase-js installed**
✅ **App builds and runs successfully**
⚠️ **Supabase credentials not yet configured** (currently using fallback mode)

## What's Currently Happening
Since Supabase credentials aren't configured, the app:
- Saves image URIs locally instead of uploading to Supabase Storage
- Still updates Firebase Realtime Database with profile image data
- Works fine for testing without cloud storage

## How to Configure Supabase (5 Minutes)

### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click **"Sign Up"**
3. Sign up with email or GitHub
4. Create a new project (choose any region)

### Step 2: Get Your Credentials
1. In Supabase Dashboard, click **Settings** (bottom left)
2. Click **API** tab
3. Copy your **Project URL** (looks like: `https://abc123xyz.supabase.co`)
4. Copy your **Anon Key** from the list (starts with `eyJ...`)

### Step 3: Create Storage Bucket
1. Click **Storage** in left sidebar
2. Click **Create a new bucket**
3. Name it: `profile-images` (exact name!)
4. Make it **Public** (toggle the switch)
5. Click **Create bucket**

### Step 4: Update SupabaseConfig.js
Open `src/SupabaseConfig.js` and replace:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

With your actual credentials:

```javascript
const SUPABASE_URL = 'https://abc123xyz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Step 5: Reload App
1. Press `r` in terminal to reload
2. Or restart the app

## ✨ That's It!

Profile pictures now upload to Supabase Storage instead of being stored locally.

## Testing
1. Go to User Profile Screen
2. Tap camera icon
3. Select image
4. Should upload to Supabase Storage
5. Verify in Supabase Dashboard → Storage → profile-images

## Need Help?
- **Module not found?** Run `npm install @supabase/supabase-js` ✅ (already done)
- **Upload fails?** Check credentials in SupabaseConfig.js
- **"Bucket not found"?** Verify bucket name is exactly `profile-images`
- **"Unauthorized"?** Make sure bucket is set to Public

## Environment Variables (Optional)
For better security, use `.env` file:

1. Create `.env` in project root:
```
SUPABASE_URL=https://your-url.supabase.co
SUPABASE_ANON_KEY=your-key-here
```

2. Install: `npm install react-native-dotenv`

3. Update `SupabaseConfig.js`:
```javascript
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
```

4. Update `babel.config.js` to include dotenv:
```javascript
const path = require('path');

module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['module:react-native-dotenv'],
    ...
  ],
};
```

## Architecture Overview
```
┌─────────────────────────────────────────────────┐
│         User Profile Screen                     │
│  (Select Image → Upload to Cloud)               │
└──────────────┬──────────────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
   Supabase        Firebase
   Storage         Database
   │               │
   image.jpg       profileImage: URL
                   profileImageUpdatedAt
```

## File Structure
```
src/
├── SupabaseConfig.js          ← Update credentials here
├── screens/
│   ├── UserProfileScreen/
│   │   └── index.jsx          ← Uses uploadProfileImageToSupabase()
│   └── EditUserProfileScreen/
│       └── index.jsx          ← Uses uploadProfileImageToSupabase()
└── ...
```

## Next Steps
- [ ] Create Supabase account
- [ ] Create storage bucket
- [ ] Update credentials in SupabaseConfig.js
- [ ] Reload app
- [ ] Test profile picture upload
- [ ] Verify images in Supabase Dashboard

Happy coding! 🚀
