import {ITraining} from "./ITraining";

export interface IStudent {
  _id: string,
  absent_training: Array<ITraining>,
  attended_training: Array<ITraining>,
  date_of_birth: any,
  gender: string,
  late_replay_training: Array<ITraining>,
  paddle_Side: string,
  weight: number
}
