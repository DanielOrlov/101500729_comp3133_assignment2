import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { TokenService } from './services/token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const tokenService = inject(TokenService);

      const authLink = new ApolloLink((operation, forward) => {
        const token = tokenService.getToken();

        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
          },
        }));

        return forward(operation);
      });

      return {
        link: ApolloLink.from([
          authLink,
          httpLink.create({
            uri: 'http://localhost:4000/graphql',
          }),
        ]),
        cache: new InMemoryCache(),
      };
    }),
  ],
};
