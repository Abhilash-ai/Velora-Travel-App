import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signOut, 
  updateProfile, 
  onAuthStateChanged
} from 'firebase/auth';

import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  query, 
  where 
} from 'firebase/firestore';

import { seedDestinations } from '../data/dbSeed';
import type { SeedDestination } from '../data/dbSeed';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

let useMock = true;
let app;
let auth: any;
let db: any;

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    useMock = false;
    console.log("🔥 Firebase initialized successfully.");
  } catch (error) {
    console.error("Firebase init failed, falling back to Local Storage DB engine:", error);
    useMock = true;
  }
} else {
  console.log("📦 Using Local Storage Database engine (no Firebase keys configured).");
}

/* --- LOCAL MEMORY / LOCAL STORAGE DATABASE ENGINE --- */

export interface UserProfile {
  uid: string;
  phoneNumber: string;
  displayName?: string;
  photoURL?: string;
  travelDNA?: {
    landscape: 'Nature' | 'Beaches';
    budget: 'Luxury' | 'Budget';
    style: 'Adventure' | 'Spiritual';
    focus: 'Photography' | 'Food';
    companions: 'Solo' | 'Group';
    terrain: 'Mountains' | 'Cities';
  };
}

class LocalDBEngine {
  private usersKey = 'velora_local_users';
  private currentSessionKey = 'velora_local_session';
  private savedTripsKey = 'velora_local_saved_trips';
  private authCallbacks: ((user: UserProfile | null) => void)[] = [];

  constructor() {
    if (!localStorage.getItem('velora_seeded')) {
      localStorage.setItem('velora_seeded', 'true');
      localStorage.setItem(this.usersKey, JSON.stringify([
        { uid: 'mock-user-id', phoneNumber: '+919876543210', displayName: 'Truecaller User', photoURL: '/images/kashmir.png', travelDNA: {
          landscape: 'Nature', budget: 'Budget', style: 'Adventure', focus: 'Photography', companions: 'Solo', terrain: 'Mountains'
        }}
      ]));
    }
  }

  // Truecaller Auth Methods
  initiateMobileVerification(_phoneNumber: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 800);
    });
  }

  verifyOTP(phoneNumber: string, otp: string): Promise<UserProfile> {
    return new Promise((resolve, reject) => {
      if (otp !== '1234') {
        return reject(new Error("Invalid OTP code. Use 1234."));
      }

      const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
      let user = users.find((u: any) => u.phoneNumber === phoneNumber);
      
      if (!user) {
        user = {
          uid: `tc-user-${Math.random().toString(36).substr(2, 9)}`,
          phoneNumber,
          displayName: 'Truecaller User',
          photoURL: '/images/kashmir.png'
        };
        users.push(user);
        localStorage.setItem(this.usersKey, JSON.stringify(users));
      }

      localStorage.setItem(this.currentSessionKey, JSON.stringify(user));
      this.triggerAuthChange(user);
      resolve(user);
    });
  }

  logout(): Promise<void> {
    return new Promise((resolve) => {
      localStorage.removeItem(this.currentSessionKey);
      this.triggerAuthChange(null);
      resolve();
    });
  }

  getCurrentUser(): UserProfile | null {
    const session = localStorage.getItem(this.currentSessionKey);
    return session ? JSON.parse(session) : null;
  }

  onAuthStateChanged(callback: (user: UserProfile | null) => void) {
    this.authCallbacks.push(callback);
    callback(this.getCurrentUser());
    return () => {
      this.authCallbacks = this.authCallbacks.filter(cb => cb !== callback);
    };
  }

  updateProfile(displayName: string, photoURL?: string): Promise<UserProfile> {
    return new Promise((resolve, reject) => {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return reject(new Error("No active session."));

      currentUser.displayName = displayName;
      if (photoURL) currentUser.photoURL = photoURL;

      const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
      const updatedUsers = users.map((u: any) => u.uid === currentUser.uid ? currentUser : u);
      localStorage.setItem(this.usersKey, JSON.stringify(updatedUsers));
      localStorage.setItem(this.currentSessionKey, JSON.stringify(currentUser));
      this.triggerAuthChange(currentUser);
      
      resolve(currentUser);
    });
  }

  updateTravelDNA(dna: UserProfile['travelDNA']): Promise<UserProfile> {
    return new Promise((resolve, reject) => {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return reject(new Error("No active session."));

      currentUser.travelDNA = dna;
      const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
      const updatedUsers = users.map((u: any) => u.uid === currentUser.uid ? currentUser : u);
      localStorage.setItem(this.usersKey, JSON.stringify(updatedUsers));
      localStorage.setItem(this.currentSessionKey, JSON.stringify(currentUser));
      this.triggerAuthChange(currentUser);
      
      resolve(currentUser);
    });
  }

  private triggerAuthChange(user: UserProfile | null) {
    this.authCallbacks.forEach(cb => cb(user));
  }

  saveTrip(userId: string, trip: any): Promise<void> {
    return new Promise((resolve) => {
      const trips = JSON.parse(localStorage.getItem(this.savedTripsKey) || '[]');
      trips.push({ id: `trip-${Date.now()}`, userId, ...trip });
      localStorage.setItem(this.savedTripsKey, JSON.stringify(trips));
      resolve();
    });
  }

  getSavedTrips(userId: string): Promise<any[]> {
    return new Promise((resolve) => {
      const trips = JSON.parse(localStorage.getItem(this.savedTripsKey) || '[]');
      resolve(trips.filter((t: any) => t.userId === userId));
    });
  }
}

const mockDb = new LocalDBEngine();

/* --- EXPOSED INTERFACE --- */

export const authService = {
  initiateMobileVerification: async (phoneNumber: string): Promise<void> => {
    if (useMock) return mockDb.initiateMobileVerification(phoneNumber);
    throw new Error("Firebase phone auth not implemented in real mode yet.");
  },

  verifyOTP: async (phoneNumber: string, otp: string): Promise<UserProfile> => {
    if (useMock) return mockDb.verifyOTP(phoneNumber, otp);
    throw new Error("Firebase phone auth not implemented in real mode yet.");
  },

  logout: async (): Promise<void> => {
    if (useMock) {
      await mockDb.logout();
    } else {
      await signOut(auth);
    }
  },

  getCurrentUser: (): UserProfile | null => {
    if (useMock) {
      return mockDb.getCurrentUser();
    } else {
      const user = auth?.currentUser;
      return user ? { uid: user.uid, phoneNumber: user.phoneNumber || "", displayName: user.displayName || "Explorer" } : null;
    }
  },

  onAuthStateChanged: (callback: (user: UserProfile | null) => void) => {
    if (useMock) {
      return mockDb.onAuthStateChanged(callback);
    } else {
      return onAuthStateChanged(auth, (user: any) => {
        callback(user ? { uid: user.uid, phoneNumber: user.phoneNumber || "", displayName: user.displayName || "Explorer" } : null);
      });
    }
  },

  updateProfile: async (displayName: string, photoURL?: string): Promise<UserProfile> => {
    if (useMock) {
      return mockDb.updateProfile(displayName, photoURL);
    } else {
      await updateProfile(auth.currentUser, { displayName, photoURL });
      const user = auth.currentUser;
      return { uid: user.uid, phoneNumber: user.phoneNumber || "", displayName: user.displayName || displayName, photoURL: user.photoURL || photoURL };
    }
  },

  updateTravelDNA: async (dna: UserProfile['travelDNA']): Promise<UserProfile> => {
    if (useMock) {
      return mockDb.updateTravelDNA(dna);
    } else {
      const user = auth.currentUser;
      if (!user) throw new Error("No active user.");
      await setDoc(doc(db, "travel_dna", user.uid), dna);
      return { uid: user.uid, phoneNumber: user.phoneNumber || "", displayName: user.displayName || "", travelDNA: dna };
    }
  }
};

export const dbService = {
  getDestinations: async (): Promise<SeedDestination[]> => {
    if (useMock) {
      return new Promise(resolve => setTimeout(() => resolve(seedDestinations), 500));
    } else {
      const snapshot = await getDocs(collection(db, "destinations"));
      return snapshot.docs.map(doc => doc.data() as SeedDestination);
    }
  },

  searchDestinations: async (queryStr: string): Promise<SeedDestination[]> => {
    if (useMock) {
      return new Promise(resolve => {
        const results = seedDestinations.filter(d => 
          d.title.toLowerCase().includes(queryStr.toLowerCase()) || 
          d.country.toLowerCase().includes(queryStr.toLowerCase())
        );
        setTimeout(() => resolve(results), 300);
      });
    } else {
      const q = query(collection(db, "destinations"), where("title", ">=", queryStr), where("title", "<=", queryStr + '\uf8ff'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as SeedDestination);
    }
  },

  saveTrip: async (userId: string, tripData: any): Promise<void> => {
    if (useMock) {
      return mockDb.saveTrip(userId, tripData);
    } else {
      const newTripRef = doc(collection(db, "users", userId, "savedTrips"));
      await setDoc(newTripRef, tripData);
    }
  },

  getSavedTrips: async (userId: string): Promise<any[]> => {
    if (useMock) {
      return mockDb.getSavedTrips(userId);
    } else {
      const snapshot = await getDocs(collection(db, "users", userId, "savedTrips"));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  }
};
