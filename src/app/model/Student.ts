import {IStudent} from "./interface/IStudent";

export class Student implements IStudent {
  _id: string;
  date_of_birth: any;
  gender: string;
  paddle_side: string;
  weight: number;
  username: string;
  reason: string = '';
  status: string = '';

  constructor(student: any) {
    this._id = student?._id ?? '';
    this.date_of_birth = student?.date_of_birth ?? '';
    this.gender = student?.gender ?? '';
    this.paddle_side = student?.paddle_side ?? '';
    this.weight = student?.weight ?? '';
    this.username = student?.username ?? '';
  }
}
