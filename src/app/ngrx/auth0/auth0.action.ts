import {createAction, props} from "@ngrx/store";

export const checkAuth = createAction('[Auth] checkAuth');
export const login = createAction('[Auth] login');
export const loginComplete = createAction('[Auth] loginComplete',
  props<{isLoggedIn: boolean, profile: any, accessToken: any}>()
);
export const logout = createAction('[Auth] logout');
export const logoutComplete = createAction('[Auth] logoutComplete');
