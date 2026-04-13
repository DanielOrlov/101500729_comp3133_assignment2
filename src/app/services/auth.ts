import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { TokenService } from './token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apollo = inject(Apollo);
  private tokenService = inject(TokenService);

  private readonly USERNAME_KEY = 'username';

  login(username: string, password: string) {
    return this.apollo.mutate<{
      login: {
        token: string;
        user: {
          _id: string;
          username: string;
          email: string;
        };
      };
    }>({
      mutation: gql`
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            token
            user {
              _id
              username
              email
            }
          }
        }
      `,
      variables: { username, password },
    });
  }

  signup(username: string, email: string, password: string) {
    return this.apollo.mutate<{
      createUser: {
        _id: string;
        username: string;
        email: string;
      };
    }>({
      mutation: gql`
        mutation CreateUser($username: String!, $email: String!, $password: String!) {
          createUser(username: $username, email: $email, password: $password) {
            _id
            username
            email
          }
        }
      `,
      variables: { username, email, password },
    });
  }

  setToken(token: string): void {
    this.tokenService.setToken(token);
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  setUsername(username: string): void {
    localStorage.setItem(this.USERNAME_KEY, username);
  }

  getUsername(): string {
    return localStorage.getItem(this.USERNAME_KEY) ?? '';
  }

  logout(): void {
    this.tokenService.clearToken();
    localStorage.removeItem(this.USERNAME_KEY);
  }
}
