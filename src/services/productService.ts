import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

const CACHE_KEY = 'veluxe_products_cache';
const CACHE_TIME_KEY = 'veluxe_products_cache_time';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const productService = {
  async getProducts(forceRefresh = false): Promise<Product[]> {
    // 1. Check Cache
    if (!forceRefresh) {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cacheTime = localStorage.getItem(CACHE_TIME_KEY);
      
      if (cachedData && cacheTime) {
        const age = Date.now() - parseInt(cacheTime);
        if (age < CACHE_DURATION) {
          console.log('Serving products from cache (Quota Optimized)');
          return JSON.parse(cachedData);
        }
      }
    }

    // 2. Fetch from Firestore (One-time fetch)
    console.log('Fetching products from Firestore...');
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      // 3. Update Cache
      localStorage.setItem(CACHE_KEY, JSON.stringify(products));
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());

      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to cache if available even if expired
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) return JSON.parse(cachedData);
      throw error;
    }
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: new Date().toISOString()
    });
    // Invalidate cache
    localStorage.removeItem(CACHE_KEY);
    return docRef.id;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, product);
    // Invalidate cache
    localStorage.removeItem(CACHE_KEY);
  },

  async deleteProduct(id: string): Promise<void> {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    // Invalidate cache
    localStorage.removeItem(CACHE_KEY);
  }
};
