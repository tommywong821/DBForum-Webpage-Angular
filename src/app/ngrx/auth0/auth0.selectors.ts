import {createFeatureSelector, createSelector} from "@ngrx/store";
import {Auth0State} from "./auth0.state";

// get the `auth0` property from the state object
export const getAuthFeatureState = createFeatureSelector<Auth0State>('auth0');

// get the isLoggedIn from the auth state
export const selectIsLoggedIn = createSelector(
  getAuthFeatureState,
  (state: Auth0State) => state.isLoggedIn
);

// get the accessToken from the auth state
export const selectAccessToken = createSelector(
  getAuthFeatureState,
  (state: Auth0State) => state.accessToken
);

// get the userProfile from the auth state
export const selectCurrentUserItsc = createSelector(
  getAuthFeatureState,
  (state: Auth0State) => state.loginUserItsc
);

// get the userProfile from the auth state
export const selectCurrentUserRole = createSelector(
  getAuthFeatureState,
  (state: Auth0State) => state.loginUserRole
);
