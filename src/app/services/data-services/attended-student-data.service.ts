import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AttendedStudentDataService {

  private _attendedStudent: any;

  get attendedStudent(): any {
    return this._attendedStudent;
  }

  set attendedStudent(value: any) {
    this._attendedStudent = value;
  }
}
