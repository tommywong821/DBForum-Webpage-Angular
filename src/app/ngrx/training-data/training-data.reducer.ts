import {TrainingDataState} from "./training-data.state";
import {ITraining} from "../../model/forum/ITraining";
import {Action, createReducer, on} from "@ngrx/store";
import * as trainingDataAction from './training-data.action';

export const initialState: TrainingDataState = {
  trainingDataList: new Array<ITraining>(),
  isLoaded: false
}

const trainingDataReducerInternal = createReducer(
  initialState,

  on(trainingDataAction.getTrainingDataListComplete, (state, {isLoaded, trainingList}) => {
    return {
      ...state,
      isLoaded: isLoaded,
      trainingDataList: trainingList
    };
  })
)

export function trainingDataReducer(state: TrainingDataState | undefined, action: Action): TrainingDataState {
  return trainingDataReducerInternal(state, action);
}
