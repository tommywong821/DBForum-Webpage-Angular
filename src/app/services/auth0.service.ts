import {Injectable} from "@angular/core";
import {AuthService} from "@auth0/auth0-angular";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class Auth0Service {
  constructor(private authService: AuthService) {
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.authService.isAuthenticated$;
  }

  get accessToken$(): Observable<any> {
    return this.authService.idTokenClaims$;
  }

  get user$(): Observable<any> {
    return this.authService.user$;
  }

  login(): void {
    this.authService.loginWithRedirect();
  }

  logout(): void{
    this.authService.logout({returnTo: document.location.origin});
  }
}
