import {IStudent} from "./IStudent";
import {ITraining} from "./ITraining";

export interface IAttendance {
  uuid?: string;
  student_id: IStudent | string;
  training_id: ITraining | string;
  status: string;
  reason: string;
  itsc: string;
  is_late_reply: boolean;
  updated_at: string;
}
