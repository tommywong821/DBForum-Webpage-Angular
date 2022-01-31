import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ITraining} from "../model/interface/ITraining";
import {environment} from "../../environments/environment";
import {IStudent} from "../model/interface/IStudent";
import {IReminder} from "../model/interface/IReminder";
import {Auth0Service} from "./auth0.service";
import {IAttendance} from "../model/interface/IAttendance";

@Injectable({
  providedIn: 'root'
})
export class AwsLambdaBackendService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient,
              private auth0: Auth0Service) {
    console.log(`[${this.constructor.name}] constructor`);
  }

  healthCheck() {
    return this.http.get<any>(this.apiUrl + "/health");
  }

  getTrainingList() {
    let params = new HttpParams().set('itsc', this.auth0.loginUserItsc);
    return this.http.get<Array<ITraining>>(this.apiUrl + "/training", {params: params});
    /*return [{
      "_id": "61ef9b635906f4da86ff89da",
      "date": "2022-02-26 11:03",
      "place": "UST",
      "type": "land",
      "created_at": "2022-02-26 11:03",
      "updated_at": ""
    }, {
      "_id": "61ef9b635906f4da86ff89db",
      "date": "2022-02-24 07:46",
      "place": "TKO",
      "type": "water",
      "created_at": "2022-02-24 07:46",
      "updated_at": ""
    }, {
      "_id": "61ef9b635906f4da86ff89dc",
      "date": "2022-02-27 08:49",
      "place": "UST",
      "type": "land",
      "created_at": "2022-02-27 08:49",
      "updated_at": ""
    }, {
      "_id": "61ef9b635906f4da86ff89dd",
      "date": "2022-02-25 00:36",
      "place": "UST",
      "type": "water",
      "created_at": "2022-02-25 00:36",
      "updated_at": ""
    }, {
      "_id": "61ef9b635906f4da86ff89de",
      "date": "2022-02-27 11:52",
      "place": "TKO",
      "type": "water",
      "created_at": "2022-02-27 11:52",
      "updated_at": ""
    }, {
      "_id": "61ef9b635906f4da86ff89df",
      "date": "2022-02-25 13:21",
      "place": "UST",
      "type": "water",
      "created_at": "2022-02-25 13:21",
      "updated_at": ""
    }, {
      "_id": "61ef9b635906f4da86ff89e0",
      "date": "2022-02-24 08:41",
      "place": "UST",
      "type": "land",
      "created_at": "2022-02-24 08:41",
      "updated_at": ""
    }];*/
  }

  createTraining(training: ITraining) {
    const body: any = {
      type: training.type,
      date: training.date,
      place: training.place
    }
    return this.http.post(this.apiUrl + "/training", body);
  }

  createTrainingList(trainingList: Array<ITraining>) {
    const body: any = {
      trainings: trainingList
    }
    return this.http.post(this.apiUrl + "/training", body);
  }

  removeTraining(trainingId: string) {
    return this.http.delete(this.apiUrl + "/training/" + trainingId);
  }

  getTrainingSummary() {
    return this.http.get<any>(this.apiUrl + "/training/summary");
    // return [{
    //   "_id": "61ef9b635906f4da86ff89d8",
    //   "date": "2022-02-27 04:40",
    //   "place": "TKO",
    //   "type": "land",
    //   "paddle_side": "left",
    //   "status": "late reply",
    //   "left_side_paddle": 2,
    //   "right_side_paddle": 0
    // }, {
    //   "_id": "61ef9b635906f4da86ff89d9",
    //   "date": "2022-02-25 18:07",
    //   "place": "UST",
    //   "type": "water",
    //   "paddle_side": "right",
    //   "status": "absent",
    //   "left_side_paddle": 1,
    //   "right_side_paddle": 1
    // }, {
    //   "_id": "61ef9b635906f4da86ff89d7",
    //   "date": "2022-02-26 03:38",
    //   "place": "TKO",
    //   "type": "land",
    //   "paddle_side": "left",
    //   "status": "absent",
    //   "left_side_paddle": 1,
    //   "right_side_paddle": 1
    // }];
  }

  getTrainingDetail(trainingId: string) {
    let params = new HttpParams().set('trainingId', trainingId);
    return this.http.get<any>(this.apiUrl + "/training/detail", {params: params});
  }

  getStudentDetail(itsc: string) {
    let params = new HttpParams().set('itsc', itsc);
    return this.http.get<IStudent>(this.apiUrl + "/student", {params: params});
  }

  createAttendance(attendance: IAttendance) {
    const body: any = {
      attendance: attendance
    }
    return this.http.post(this.apiUrl + "/attendance", body);
  }

  getReminderMessage() {
    return this.http.get<IReminder>(this.apiUrl + '/reminder');
  }

  updateReminderMessage(reminderId: string, reminderMessage: IReminder) {
    return this.http.put(this.apiUrl + "/reminder/" + reminderId, reminderMessage);
  }

  updateStudentProfile(itsc: string, profile: IStudent) {
    return this.http.put(this.apiUrl + "/student/" + itsc, profile);
  }
}
