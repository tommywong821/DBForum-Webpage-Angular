import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Auth0Service} from "../../services/auth0.service";
import * as auth0Action from './auth0.action';
import {combineLatest, of, switchMap, tap} from "rxjs";
import {Store} from "@ngrx/store";

@Injectable()
export class Auth0Effect{
  constructor(private actions$: Actions,
              private auth0Service: Auth0Service,
              private store: Store<any>) {
  }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(auth0Action.login),
      tap(() => this.auth0Service.login())
    ),
    {dispatch: false}
  );

  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      // If an action with the type 'checkAuth' occurs in the actions$ stream...
      ofType(auth0Action.checkAuth),
      // return an observable including the latest info from 'isLoggedIn' and 'userProfile'
      switchMap(() =>
        combineLatest([this.auth0Service.isLoggedIn$, this.auth0Service.user$, this.auth0Service.accessToken$]),
      ),
      // Take it out and return the appropriate action based on if logged in or not
      switchMap(([isLoggedIn, profile, accessToken]) => {
        if (isLoggedIn) {
          return of(auth0Action.loginComplete({ isLoggedIn, profile, accessToken }));
        }

        return of(auth0Action.logoutComplete());
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(auth0Action.logout),
      tap(() => this.auth0Service.logout()),
      switchMap(() => of(auth0Action.logoutComplete()))
    )
  )
}
