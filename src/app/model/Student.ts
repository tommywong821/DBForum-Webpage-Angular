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
  created_at: string;
  updated_at: string;
  email: string

  constructor(student: any) {
    this._id = student?._id ?? '';
    this.date_of_birth = student?.date_of_birth ?? '';
    this.gender = student?.gender ?? '';
    this.paddle_side = student?.paddle_side ?? '';
    this.weight = student?.weight ?? '';
    this.username = student?.username ?? '';
    this.updated_at = student?.updated_at ?? '';
    this.created_at = student?.created_at ?? '';
    this.email = student?.email ?? '';
  }
}
