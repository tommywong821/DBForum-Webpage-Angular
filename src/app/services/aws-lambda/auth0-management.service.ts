import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {IStudentAccount} from "../../model/auth0-management/IStudentAccount";
import {IUserRole} from "../../model/auth0-management/IUserRole";

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

  getStudentAccountList() {
    return this.http.get<Array<IStudentAccount>>(this.apiUrl + "/user");
  }

  getUserRolesList() {
    return this.http.get<IUserRole>(this.apiUrl + "/role");
  }

  assignRoleToUsers(roleId: string, userIdList: Array<string>) {
    const body = {
      roleId: roleId,
      userIdList: userIdList
    }
    return this.http.post(this.apiUrl + '/role/assign', body);
  }
}
