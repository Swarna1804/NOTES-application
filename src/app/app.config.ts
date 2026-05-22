import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // Register Firebase providers only in the browser to avoid SSR errors
    ...(typeof window === 'undefined'
      ? []
      : [
          provideFirebaseApp(() => initializeApp(environment.firebase)),
          provideAuth(() => getAuth()),
        ]),
  ]
};