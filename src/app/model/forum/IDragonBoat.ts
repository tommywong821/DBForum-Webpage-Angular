import {IStudent} from "./IStudent";

export interface IDragonBoat {
  id: string;
  leftSeatList: Array<IStudent>;
  rightSeatList: Array<IStudent>;
}
