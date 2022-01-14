import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ITraining} from "../model/interface/ITraining";
import {environment} from "../../environments/environment";
import {Training} from "../model/Training";

@Injectable({
  providedIn: 'root'
})
export class AwsLambdaBackendService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log(`[${this.constructor.name}] constructor`);
  }

  healthCheck() {
    return this.http.get<any>(this.apiUrl + "/health");
  }

  getTrainingList() {
    return this.http.get<Array<Training>>(this.apiUrl + "/training");
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
}
