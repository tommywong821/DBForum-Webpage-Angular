import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ITraining} from "../model/interface/ITraining";
import {environment} from "../../environments/environment";
import {Training} from "../model/Training";
import {IStudent} from "../model/interface/IStudent";
import {Attendance} from "../model/Attendance";
import {AuthService} from "@auth0/auth0-angular";

@Injectable({
  providedIn: 'root'
})
export class AwsLambdaBackendService {
  private apiUrl: string = environment.apiUrl;
  private loginUsername: string = '';

  constructor(private http: HttpClient,
              private auth: AuthService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.auth.user$.subscribe({
      next: (user) => {
        if (user) {
          this.loginUsername = user['http://demozero.net/username'];
        }
      },
      complete: () => {
        localStorage.setItem(environment.usernameKey, this.loginUsername);
      }
    });
  }

  healthCheck() {
    return this.http.get<any>(this.apiUrl + "/health");
  }

  getTrainingList() {
    // let params = new HttpParams().set('username', localStorage.getItem(environment.usernameKey)!.toString());
    let params = new HttpParams().set('username', this.loginUsername);
    return this.http.get<Array<Training>>(this.apiUrl + "/training", {params: params});
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
  }

  getTrainingDetail(trainingId: string) {
    let params = new HttpParams().set('trainingId', trainingId);
    return this.http.get<any>(this.apiUrl + "/training/detail", {params: params});
  }

  getStudentDetail(username: string) {
    let params = new HttpParams().set('username', username);
    return this.http.get<IStudent>(this.apiUrl + "/student", {params: params});
  }

  createAttendance(attendance: Attendance) {
    const body: any = {
      attendance: attendance
    }
    return this.http.post(this.apiUrl + "/attendance", body);
  }
}
