import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { movieReducer } from './store/reducers/movie.reducer';
import { bucketReducer } from './store/reducers/bucket.reducer';
import { MovieEffects } from './store/effects/movie.effect';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      movies: movieReducer,
      bucket: bucketReducer
    }),
    provideEffects([MovieEffects]),
    provideStoreDevtools({
      maxAge: 10,
      logOnly: !isDevMode(),
      autoPause: false,
      trace: true,
      traceLimit: 75,
      connectInZone: true
    })
  ]
};
