import {IStudent} from "./IStudent";

export interface IDragonBoat {
  id: number;
  leftSeatList: Array<IStudent>;
  left_seat: Array<string>;
  rightSeatList: Array<IStudent>;
  right_seat: Array<string>;
  steersperson: any;
  leftStudentList?: any;
  rightStudentList?: any;
}
