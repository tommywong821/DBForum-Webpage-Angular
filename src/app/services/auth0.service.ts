import {EventEmitter, Injectable} from '@angular/core';
import {AuthService, User} from "@auth0/auth0-angular";

@Injectable({
  providedIn: 'root'
})
export class Auth0Service {
  stateChanged: EventEmitter<boolean>;

  private _loginRole: string;
  private _loginUserItsc: string;
  private _isAuthenticated: boolean;

  constructor(private auth: AuthService) {
    this._loginRole = '';
    this._loginUserItsc = '';
    this._isAuthenticated = false;
    this._accessToken = '';
    this.stateChanged = new EventEmitter<boolean>();
  }

  private _accessToken: string;

  get accessToken(): string {
    return this._accessToken;
  }

  set accessToken(value: string) {
    this._accessToken = value;
  }

  get loginRole(): string {
    return this._loginRole;
  }

  set loginRole(value: string) {
    this._loginRole = value;
  }


  get loginUserItsc(): string {
    return this._loginUserItsc;
  }

  set loginUserItsc(value: string) {
    this._loginUserItsc = value;
  }


  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  set isAuthenticated(value: boolean) {
    this._isAuthenticated = value;
  }

  initUserData(user: User, accessToken: string) {
    this.loginUserItsc = user['http://demozero.net/itsc'];
    this.loginRole = user['http://demozero.net/roles'];
    this.isAuthenticated = true;
    this.accessToken = accessToken;
    this.stateChanged.emit(true);
  }

  logout() {
    this.auth.logout({returnTo: document.location.origin});
    this._loginRole = '';
    this._loginUserItsc = '';
    this._isAuthenticated = false;
    this._accessToken = '';
  }
}
