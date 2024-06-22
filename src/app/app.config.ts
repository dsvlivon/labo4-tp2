import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimationsAsync(), 
    provideHttpClient(), 
    provideFirebaseApp(() => initializeApp({
      "projectId":"labo4tp2",
      "appId":"1:1084582494770:web:95f3c06c36c6bd89b4b22b",
      "storageBucket":"labo4tp2.appspot.com",
      "apiKey":"AIzaSyD4YgPP0BgT9__nHk9ThqnZH5FSz1L3aZY",
      "authDomain":"labo4tp2.firebaseapp.com",
      "messagingSenderId":"1084582494770"})), 
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), 
    provideStorage(() => getStorage())
    ]
};

// provideFirebaseApp(() => initializeApp({
//   "projectId":"labo4tp2",
//   "appId":"1:1084582494770:web:95f3c06c36c6bd89b4b22b",
//   "storageBucket":"labo4tp2.appspot.com",
//   "locationId":"us-central",
//   "apiKey":"AIzaSyD4YgPP0BgT9__nHk9ThqnZH5FSz1L3aZY",
//   "authDomain":"labo4tp2.firebaseapp.com",
//   "messagingSenderId":"1084582494770"}
// )), provideStorage(() => getStorage()), 
