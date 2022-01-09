import {ITraining} from "./ITraining";

export interface IStudent {
  _id: string,
  date_of_birth: any,
  gender: string,
  paddle_Side: string,
  weight: number,
  attended_training: Array<ITraining | string>,
  late_replay_training: Array<ITraining | string>,
  absent_training: Array<ITraining | string>,
}
