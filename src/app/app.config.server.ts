import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { Auth } from '@angular/fire/auth';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Provide a noop Auth on the server so services depending on `Auth` can be
    // instantiated during SSR without Firebase being initialized.
    { provide: Auth, useValue: null }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
