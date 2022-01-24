import {IStudent} from "./IStudent";
import {ITraining} from "./ITraining";

export interface IAttendance {
  _id?: string;
  student_id: IStudent | string;
  training_id: ITraining | string;
  status: string;
  reason: string;
}
