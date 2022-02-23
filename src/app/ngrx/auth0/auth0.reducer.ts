import {Auth0State} from "./auth0.state";
import {Action, createReducer, on} from "@ngrx/store";
import * as auth0Action from './auth0.action';

export const initialState: Auth0State = {
  isLoggedIn: false,
  accessToken: null,
  loginUserItsc: null,
  loginUserRole: null,
};

const auth0ReducerInternal = createReducer(
  initialState,

  on(auth0Action.loginComplete, (state, {profile, isLoggedIn, accessToken}) => {
    return {
      ...state,
      userProfile: profile,
      isLoggedIn: isLoggedIn,
      accessToken: accessToken.__raw,
      loginUserItsc: profile['http://demozero.net/itsc'],
      loginUserRole: profile['http://demozero.net/roles'],
    };
  }),

  on(auth0Action.logoutComplete, (state, {}) => {
    return {
      ...state,
      isLoggedIn: false,
      accessToken: null,
      loginUserItsc: null,
      loginUserRole: null,
    };
  })
);

export function auth0Reducer(state: Auth0State | undefined, action: Action): Auth0State{
  return auth0ReducerInternal(state, action);
}
