import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ITraining} from "../model/interface/ITraining";

@Injectable({
  providedIn: 'root'
})
export class AwsLambdaBackendService {
  private apiUrl: string = "https://pyret1uvgk.execute-api.ap-southeast-1.amazonaws.com/dev";

  constructor(private http: HttpClient) {
    console.log(`[${this.constructor.name}] constructor`);
  }

  healthCheck() {
    return this.http.get<any>(this.apiUrl + "/health");
  }

  getTrainingList() {
    return this.http.get<Array<ITraining>>(this.apiUrl + "/training");
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
    const requestBody: any = {
      trainingId: trainingId
    }
    return this.http.delete(this.apiUrl + "/training", {body: requestBody});
  }

  getTrainingSummary() {
    return this.http.get<any>(this.apiUrl + "/training/summary");
  }
}
