import {createAction, props} from "@ngrx/store";
import {ITraining} from "../../model/forum/ITraining";

export const getTrainingDataList = createAction('[TrainingData] getTrainingDataList');
export const getTrainingDataListComplete = createAction('[TrainingData] getTrainingDataList complete',
  props<{ isLoaded: boolean, trainingList: Array<ITraining> }>()
);
export const updateTrainingDataList = createAction('[TrainingData] updateTrainingDataList',
  props<{ trainingList: Array<ITraining> }>()
);
