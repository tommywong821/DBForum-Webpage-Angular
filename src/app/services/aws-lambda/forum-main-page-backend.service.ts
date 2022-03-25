import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ITraining} from "../../model/forum/ITraining";
import {environment} from "../../../environments/environment";
import {IStudent} from "../../model/forum/IStudent";
import {IReminder} from "../../model/forum/IReminder";
import {IAttendance} from "../../model/forum/IAttendance";
import {select, Store} from "@ngrx/store";
import {selectCurrentUserItsc} from "../../ngrx/auth0/auth0.selectors";

@Injectable({
  providedIn: 'root'
})
export class ForumMainPageBackendService {
  private apiUrl: string = environment.forumApiUrl + '/mainpage';
  private itsc: any;

  constructor(private http: HttpClient,
              private store: Store<any>) {
    this.store.pipe(select(selectCurrentUserItsc)).subscribe({
      next: (userItsc) => {
        this.itsc = userItsc;
      }
    })
  }

  healthCheck() {
    return this.http.get<any>(this.apiUrl + "/health");
  }

  getTrainingList() {
    const params = new HttpParams().set('itsc', this.itsc);
    return this.http.get<Array<ITraining>>(this.apiUrl + "/training", {params: params});
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
    return this.http.post<Array<ITraining>>(this.apiUrl + "/training", body);
  }

  removeTraining(trainingId: string) {
    return this.http.delete(this.apiUrl + "/training/" + trainingId);
  }

  getTrainingSummary(page: number, pageSize: number, fromDate: any, toDate: any) {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize)
      .set('fromDate', fromDate)
      .set('toDate', toDate);
    return this.http.get<any>(this.apiUrl + "/training/summary", {params: params});
  }

  getTrainingDetail(trainingUuid: string) {
    const params = new HttpParams().set('trainingId', trainingUuid);
    return this.http.get<any>(this.apiUrl + "/training/detail", {params: params});
  }

  getStudentDetail(itsc: string) {
    const params = new HttpParams().set('itsc', itsc);
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

  updateTrainingInfo(trainingId: string, training: ITraining) {
    return this.http.put(this.apiUrl + "/training/" + trainingId, training);
  }

  updateNoShowStudentAttendance(trainingId: string, noShowStudentIdList: string[], showUpStudentIdList: string[]) {
    const body = {
      noShowStudentIdList: noShowStudentIdList,
      showUpStudentIdList: showUpStudentIdList
    };
    return this.http.put(this.apiUrl + "/attendance/" + trainingId, body);
  }

  updateTrainingSearArr(trainingId: any, seatArrList: any) {
    const body = {
      seatArrList: seatArrList
    }
    return this.http.put(this.apiUrl + "/training/seat/" + trainingId, body);
  }

  getTrainingSearArr(trainingId: any) {
    const params = new HttpParams().set('trainingId', trainingId);
    return this.http.get(this.apiUrl + "/training/seat", {params: params});
  }

  getCoachList() {
    return this.http.get(this.apiUrl + "/coach");
  }

  updateCoach(coachInfo: any, coachUuid: any) {
    const body = {
      coachInfo: coachInfo
    }
    return this.http.put(this.apiUrl + "/coach/" + coachUuid, body)
  }
}
