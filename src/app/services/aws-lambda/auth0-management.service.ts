import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class Auth0ManagementService {
  private apiUrl: string = environment.auth0ManagementApiUrl;

  constructor(private http: HttpClient) {
  }

  createLoginUser(studentInfoCsv: string) {
    return this.http.post(this.apiUrl + "/user", studentInfoCsv);
  }
}
