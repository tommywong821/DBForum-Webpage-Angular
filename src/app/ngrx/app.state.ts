import {Auth0State} from "./auth0/auth0.state";
import {TrainingDataState} from "./training-data/training-data.state";
import {auth0Reducer} from "./auth0/auth0.reducer";
import {trainingDataReducer} from "./training-data/training-data.reducer";

export interface AppState {
  auth0: Auth0State;
  trainingData: TrainingDataState;
}

export const AppReducer = {
  auth0: auth0Reducer,
  trainingData: trainingDataReducer
}
