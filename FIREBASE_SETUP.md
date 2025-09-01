# Firebase Setup Guide

## Required Indexes

To resolve the Firebase query errors, you need to create the following composite indexes in your Firebase Console:

### 1. Favorite Quotes Index
**Collection:** `favorite_quotes`
**Fields:**
- `userId` (Ascending)
- `savedAt` (Descending)

**Steps:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `playgroundai-a1e1b`
3. Go to Firestore Database → Indexes
4. Click "Create Index"
5. Collection ID: `favorite_quotes`
6. Add fields:
   - Field path: `userId`, Order: `Ascending`
   - Field path: `savedAt`, Order: `Descending`
7. Click "Create"

### 2. Generated Images Index
**Collection:** `generated_images`
**Fields:**
- `userId` (Ascending)
- `savedAt` (Descending)

**Steps:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `playgroundai-a1e1b`
3. Go to Firestore Database → Indexes
4. Click "Create Index"
5. Collection ID: `generated_images`
6. Add fields:
   - Field path: `userId`, Order: `Ascending`
   - Field path: `savedAt`, Order: `Descending`
7. Click "Create"

### 3. User Activities Index
**Collection:** `user_activities`
**Fields:**
- `userId` (Ascending)
- `createdAt` (Descending)

**Steps:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `playgroundai-a1e1b`
3. Go to Firestore Database → Indexes
4. Click "Create Index"
5. Collection ID: `user_activities`
6. Add fields:
   - Field path: `userId`, Order: `Ascending`
   - Field path: `createdAt`, Order: `Descending`
7. Click "Create"

## Security Rules

Make sure your Firestore security rules allow authenticated users to read/write their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User activities
    match /user_activities/{docId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Favorite quotes
    match /favorite_quotes/{docId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Generated images
    match /generated_images/{docId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Quick Links

- **Firebase Console:** https://console.firebase.google.com/project/playgroundai-a1e1b
- **Firestore Indexes:** https://console.firebase.google.com/project/playgroundai-a1e1b/firestore/indexes
- **Firestore Rules:** https://console.firebase.google.com/project/playgroundai-a1e1b/firestore/rules

## Troubleshooting

If you still see index errors after creating the indexes:

1. **Wait for Index Creation**: Indexes can take a few minutes to build
2. **Check Index Status**: Go to the Indexes tab and ensure they show "Enabled" status
3. **Clear Browser Cache**: Sometimes cached queries can cause issues
4. **Restart Development Server**: Run `npm run dev` again

## Alternative: Direct Index Creation Links

You can use these direct links to create the required indexes:

- **Favorite Quotes Index:** https://console.firebase.google.com/v1/r/project/playgroundai-a1e1b/firestore/indexes?create_composite=Clpwcm9qZWN0cy9wbGF5Z3JvdW5kYWktYTFlMWIvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2Zhdm9yaXRlX3F1b3Rlcy9pbmRleGVzL18QARoKCgZ1c2VySWQQARoLCgdzYXZlZEF0EAIaDAoIX19uYW1lX18QAg
