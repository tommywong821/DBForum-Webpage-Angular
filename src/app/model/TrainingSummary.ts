import {ITraining} from "./interface/ITraining";

export class TrainingSummary implements ITraining {
  _id: string;
  date: any;
  place: string;
  type: string;
  paddle_side: string | undefined;
  left_side_paddle: number;
  right_side_paddle: number;

  constructor(trainingObj: TrainingSummary) {
    this._id = (trainingObj._id) ? trainingObj._id : '';
    this.date = trainingObj.date;
    this.place = trainingObj.place;
    this.type = trainingObj.type
    this.paddle_side = trainingObj.paddle_side;
    this.left_side_paddle = trainingObj.left_side_paddle;
    this.right_side_paddle = trainingObj.right_side_paddle;
  }
}
