import {ITraining} from "./interface/ITraining";

export class Training implements ITraining {
  _id: string;
  date: any;
  place: string;
  type: string;

  constructor(trainingObj: ITraining) {
    this._id = (trainingObj._id) ? trainingObj._id : '';
    this.date = trainingObj.date;
    this.place = trainingObj.place;
    this.type = trainingObj.type
  }
}
