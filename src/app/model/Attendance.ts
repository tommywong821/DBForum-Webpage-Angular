import {IAttendance} from "./interface/IAttendance";
import {IStudent} from "./interface/IStudent";
import {ITraining} from "./interface/ITraining";

export class Attendance implements IAttendance {
  _id: string;
  student_id: IStudent | string;
  training_id: ITraining | string;
  status: string;
  reason: string;

  constructor(attendanceObj: IAttendance) {
    this._id = attendanceObj._id;
    this.student_id = attendanceObj.student_id;
    this.training_id = attendanceObj._id;
    this.status = attendanceObj.status;
    this.reason = attendanceObj.reason;
  }
}
