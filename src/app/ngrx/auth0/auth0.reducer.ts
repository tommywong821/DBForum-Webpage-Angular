import {Auth0State} from "./auth0.state";
import {Action, createReducer, on} from "@ngrx/store";
import * as auth0Action from './auth0.action';

export const initialState: Auth0State = {
  userProfile: null,
  isLoggedIn: false,
  accessToken: null,
};

const auth0ReducerInternal = createReducer(
  initialState,

  on(auth0Action.loginComplete, (state, {profile, isLoggedIn, accessToken}) => {
    return{
      ...state,
      userProfile: profile,
      isLoggedIn: isLoggedIn,
      accessToken: accessToken,
    };
  }),

  on(auth0Action.logoutComplete, (state, {}) => {
    return{
      ...state,
      userProfile: null,
      isLoggedIn: false,
      accessToken: null,
    };
  })
);

export function auth0Reducer(state: Auth0State | undefined, action: Action): Auth0State{
  return auth0ReducerInternal(state, action);
}
