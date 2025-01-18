import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loggingInterceptor } from './interceptors/logging.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppErrorHandler } from './app.error.handler';
import { loadingInterceptor } from './interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: ErrorHandler, useClass: AppErrorHandler},
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(
      routes,
      withComponentInputBinding(),  // Enable route parameter binding
      withViewTransitions(),        // Enable route transitions
    ),
    provideHttpClient(
      withInterceptors([loggingInterceptor, loadingInterceptor]),      
    ), provideAnimationsAsync(),
  ]
};
