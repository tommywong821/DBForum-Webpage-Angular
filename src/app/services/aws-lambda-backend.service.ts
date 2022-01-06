import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AwsLambdaBackendService {
  private apiUrl: string = "https://jx0d4zabl6.execute-api.us-west-2.amazonaws.com/dev";

  constructor(private http: HttpClient) {
    console.log(`[${this.constructor.name}] constructor`);
  }

  healthCheck() {
    return this.http.get<any>(this.apiUrl + "/health");
  }
}
