import {createAction, props} from "@ngrx/store";

export const getTrainingDataList = createAction('[TrainingData] getTrainingDataList');
export const getTrainingDataListComplete = createAction('[TrainingData] getTrainingDataList complete',
  props<{ isLoaded: boolean, trainingList: any }>()
);
