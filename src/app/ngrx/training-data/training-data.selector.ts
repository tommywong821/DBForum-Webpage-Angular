import {createFeatureSelector, createSelector} from "@ngrx/store";
import {TrainingDataState} from "./training-data.state";

export const getTrainingDataFeatureState = createFeatureSelector<TrainingDataState>('trainingData');

export const selectTrainingDataList = createSelector(
  getTrainingDataFeatureState,
  (state: TrainingDataState) => state.trainingDataList
);

export const selectIsLoaded = createSelector(
  getTrainingDataFeatureState,
  (state: TrainingDataState) => state.isLoaded
);
