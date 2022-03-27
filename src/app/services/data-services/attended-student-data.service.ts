import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AttendedStudentDataService {

  private _attendedStudent: any
    /*    = {
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
            "student_id": "8473e3d9-3ba4-4fcc-ab82-b46bc969ed2d",
            "reason": "",
            "is_late_reply": false,
            "itsc": "khlamas",
            "gender": "male",
            "nickname": "Allen",
            "paddle_side": "left",
            "weight": 70
          },

        ],
        "rightStudent": [
          {
            "student_id": "e633e966-46da-41a1-be02-3a55d6ec57d2",
            "reason": "",
            "is_late_reply": false,
            "itsc": "twlauad",
            "gender": "male",
            "nickname": "Wai (DLLM→)",
            "paddle_side": "right",
            "weight": 74
          },
          {
            "student_id": "b5fd3924-9a83-40b9-be3e-d5a912017381",
            "reason": "",
            "is_late_reply": false,
            "itsc": "hlhluiaa",
            "gender": "female",
            "nickname": "Hilary",
            "paddle_side": "right",
            "weight": 66
          }
        ]
      }*/
  ;

  get attendedStudent(): any {
    return this._attendedStudent;
  }

  set attendedStudent(value: any) {
    this._attendedStudent = value;
  }
}
