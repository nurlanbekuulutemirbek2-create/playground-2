import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll
} from 'firebase/storage';
import { db, storage } from './firebase';

// Type definitions
interface FirestoreData {
  [key: string]: unknown;
}

interface QueryFilter {
  field: string;
  operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in';
  value: unknown;
}

// Firestore Database Operations
export class FirestoreService {
  // Get all documents from a collection
  static async getAll(collectionName: string) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  // Get a single document by ID
  static async getById(collectionName: string, docId: string) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  // Add a new document
  static async add(collectionName: string, data: FirestoreData) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  // Update a document
  static async update(collectionName: string, docId: string, data: FirestoreData) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Delete a document
  static async delete(collectionName: string, docId: string) {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Query documents with filters
  static async query(collectionName: string, filters: QueryFilter[] = [], orderByField?: string, limitCount?: number) {
    try {
      let q: any = collection(db, collectionName);
      
      // Apply filters
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });
      
      // Apply ordering
      if (orderByField) {
        q = query(q, orderBy(orderByField, 'desc'));
      }
      
      // Apply limit
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  }
}

// Firebase Storage Operations
export class StorageService {
  // Upload a file
  static async uploadFile(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Get download URL for a file
  static async getDownloadURL(path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }

  // Delete a file
  static async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // List all files in a directory
  static async listFiles(path: string): Promise<string[]> {
    try {
      const storageRef = ref(storage, path);
      const result = await listAll(storageRef);
      return result.items.map(item => item.fullPath);
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }
}

// User-specific operations
export class UserService {
  // Save user profile
  static async saveUserProfile(userId: string, profileData: FirestoreData) {
    try {
      await FirestoreService.update('users', userId, profileData);
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  // Get user profile
  static async getUserProfile(userId: string) {
    try {
      return await FirestoreService.getById('users', userId);
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Save user activity
  static async saveUserActivity(userId: string, activityData: FirestoreData) {
    try {
      const activityId = await FirestoreService.add('user_activities', {
        userId,
        ...activityData
      });
      return activityId;
    } catch (error) {
      console.error('Error saving user activity:', error);
      throw error;
    }
  }

  // Get user activities
  static async getUserActivities(userId: string, limitCount: number = 10) {
    try {
      return await FirestoreService.query(
        'user_activities',
        [{ field: 'userId', operator: '==', value: userId }],
        'createdAt',
        limitCount
      );
    } catch (error) {
      console.error('Error getting user activities:', error);
      throw error;
    }
  }
}

// Quote-specific operations
export class QuoteService {
  // Save a favorite quote
  static async saveFavoriteQuote(userId: string, quoteData: FirestoreData) {
    try {
      const quoteId = await FirestoreService.add('favorite_quotes', {
        userId,
        ...quoteData,
        savedAt: serverTimestamp()
      });
      return quoteId;
    } catch (error) {
      console.error('Error saving favorite quote:', error);
      throw error;
    }
  }

  // Get user's favorite quotes
  static async getFavoriteQuotes(userId: string) {
    try {
      return await FirestoreService.query(
        'favorite_quotes',
        [{ field: 'userId', operator: '==', value: userId }],
        'savedAt',
        50 // Add limit to avoid index issues
      );
    } catch (error) {
      console.error('Error getting favorite quotes:', error);
      throw error;
    }
  }

  // Delete a favorite quote
  static async deleteFavoriteQuote(quoteId: string) {
    try {
      await FirestoreService.delete('favorite_quotes', quoteId);
    } catch (error) {
      console.error('Error deleting favorite quote:', error);
      throw error;
    }
  }
}

// Image-specific operations
export class ImageService {
  // Save a generated image
  static async saveGeneratedImage(userId: string, imageData: FirestoreData) {
    try {
      const imageId = await FirestoreService.add('generated_images', {
        userId,
        ...imageData,
        savedAt: serverTimestamp()
      });
      return imageId;
    } catch (error) {
      console.error('Error saving generated image:', error);
      throw error;
    }
  }

  // Get user's generated images
  static async getGeneratedImages(userId: string, limitCount: number = 20) {
    try {
      return await FirestoreService.query(
        'generated_images',
        [{ field: 'userId', operator: '==', value: userId }],
        'savedAt',
        limitCount
      );
    } catch (error) {
      console.error('Error getting generated images:', error);
      throw error;
    }
  }

  // Delete a generated image
  static async deleteGeneratedImage(imageId: string) {
    try {
      await FirestoreService.delete('generated_images', imageId);
    } catch (error) {
      console.error('Error deleting generated image:', error);
      throw error;
    }
  }

  // Get user's image generation statistics
  static async getUserImageStats(userId: string) {
    try {
      const images = await this.getGeneratedImages(userId, 1000); // Get all images for stats
      const totalImages = images.length;
      const recentImages = images.filter(img => {
        const imgDate = new Date(img.savedAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return imgDate > weekAgo;
      }).length;

      return {
        totalImages,
        recentImages,
        lastGenerated: images.length > 0 ? images[0].savedAt : null
      };
    } catch (error) {
      console.error('Error getting user image stats:', error);
      throw error;
    }
  }
}
