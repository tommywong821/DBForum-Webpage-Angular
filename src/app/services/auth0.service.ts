import {Injectable} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";

@Injectable({
  providedIn: 'root'
})
export class Auth0Service {
  constructor(private auth: AuthService) {
    this._loginRole = '';
    this._loginUsername = '';
    this._isAuthenticated = false
  }

  private _loginRole: string;

  get loginRole(): string {
    return this._loginRole;
  }

  set loginRole(value: string) {
    this._loginRole = value;
  }

  private _loginUsername: string;

  get loginUsername(): string {
    return this._loginUsername;
  }

  set loginUsername(value: string) {
    this._loginUsername = value;
  }

  private _isAuthenticated: boolean;

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  set isAuthenticated(value: boolean) {
    this._isAuthenticated = value;
  }

  logout() {
    this.auth.logout({returnTo: document.location.origin});
    this._loginRole = '';
    this._loginUsername = '';
    this._isAuthenticated = false
  }
}
