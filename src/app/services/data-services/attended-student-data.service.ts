import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AttendedStudentDataService {

  private _attendedStudent: any = {
    "leftStudent": [
      {
        "uuid": "884fbc57-9030-4012-a805-a6df0ab5c138",
        "student_id": "884fbc57-9030-4012-a805-a6df0ab5c138",
        "training_id": "b4741f13-f908-4495-ac3c-f9e3c2f9e820",
        "reason": "",
        "status": "attend",
        "is_late_reply": false,
        "updated_at": "2022-03-08T00:00:00.000Z",
        "is_no_show": true,
        "itsc": "tkwongax",
        "date_of_birth": "1999-08-20T00:00:00.000Z",
        "gender": "male",
        "nickname": "Tommy",
        "paddle_side": "left",
        "weight": 70
      },
      {
        "student_id": "884fbc57-9030-4012-a805-a6df0ab5c138",
        "reason": "",
        "is_late_reply": false,
        "itsc": "tkwongax",
        "gender": "female",
        "nickname": "Tester1",
        "paddle_side": "left",
        "weight": 70
      },
      {
        "student_id": "884fbc57-9030-4012-a805-a6df0ab5c138",
        "reason": "",
        "is_late_reply": false,
        "itsc": "tkwongax",
        "gender": "female",
        "nickname": "Tester2",
        "paddle_side": "left",
        "weight": 70
      },
    ],
    "rightStudent": [
      {
        "student_id": "884fbc57-9030-4012-a805-a6df0ab5c138",
        "reason": "",
        "is_late_reply": false,
        "itsc": "tkwongax",
        "gender": "male",
        "nickname": "Tester3",
        "paddle_side": "right",
        "weight": 70
      },
      {
        "student_id": "884fbc57-9030-4012-a805-a6df0ab5c138",
        "reason": "",
        "is_late_reply": false,
        "itsc": "tkwongax",
        "gender": "male",
        "nickname": "Tester4",
        "paddle_side": "right",
        "weight": 70
      }
    ]
  };

  get attendedStudent(): any {
    return this._attendedStudent;
  }

  set attendedStudent(value: any) {
    this._attendedStudent = value;
  }
}
