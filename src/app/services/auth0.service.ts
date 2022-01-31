import {Injectable} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";

@Injectable({
  providedIn: 'root'
})
export class Auth0Service {
  constructor(private auth: AuthService) {
    this._loginRole = '';
    this._loginUserItsc = '';
    this._isAuthenticated = false
  }

  private _loginRole: string;

  get loginRole(): string {
    return this._loginRole;
  }

  set loginRole(value: string) {
    this._loginRole = value;
  }

  private _loginUserItsc: string;

  get loginUserItsc(): string {
    return this._loginUserItsc;
  }

  set loginUserItsc(value: string) {
    this._loginUserItsc = value;
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
    this._loginUserItsc = '';
    this._isAuthenticated = false
  }
}
