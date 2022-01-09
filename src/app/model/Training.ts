import {ITraining} from "./interface/ITraining";
import {IStudent} from "./interface/IStudent";

export class Training implements ITraining {
  _id: string;
  date: any;
  place: string;
  type: string;
  attended_student: Array<IStudent | string> = [];
  late_replay_student: Array<IStudent | string> = [];
  absent_student: Array<IStudent | string> = [];

  constructor(trainingObj: ITraining) {
    this._id = (trainingObj._id) ? trainingObj._id : '';
    this.date = trainingObj.date;
    this.place = trainingObj.place;
    this.type = trainingObj.type
  }
}
