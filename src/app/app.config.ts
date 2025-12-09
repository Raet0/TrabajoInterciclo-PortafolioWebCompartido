import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';

const firebaseConfig = {
  apiKey: 'AIzaSyDMZgIN0CxHu2VCCCbVNzj350xIosmpSe0',
  authDomain: 'adminstrative-portfolio.firebaseapp.com',
  projectId: 'adminstrative-portfolio',
  storageBucket: 'adminstrative-portfolio.appspot.com', // Corregido el dominio del storage bucket
  messagingSenderId: '365556310122',
  appId: '1:365556310122:web:c3b8bac096c2a364ef6a13',
  measurementId: 'G-STEWD25BTD',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)), // Usamos el objeto firebaseConfig directamente
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};