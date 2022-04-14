import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {IStudentAccount} from "../../model/auth0-management/IStudentAccount";
import {IUserRole} from "../../model/auth0-management/IUserRole";

@Injectable({
  providedIn: 'root'
})
export class ForumBackendManagementService {
  private apiUrl: string = environment.backendApiUrl + '/management';

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
    return this.http.post(this.apiUrl + '/user/role/assign', body);
  }

  getUserInRole(roleId: string) {
    const params = new HttpParams().set('roleId', roleId);
    return this.http.get<Array<IStudentAccount>>(this.apiUrl + '/user/role', {params: params});
  }

  removeRoleFromUser(roleId: string, userIdList: Array<string>) {
    const body = {
      roleId: roleId,
      userIdList: userIdList
    }
    return this.http.delete(this.apiUrl + '/user/role/remove', {body: body});
  }

  deleteUserAccount(userIdList: Array<string>) {
    const body = {
      userIdList: userIdList
    }
    return this.http.delete(this.apiUrl + '/user', {body: body});
  }

  getStudent(isActive: boolean) {
    const params = new HttpParams().set('isActive', isActive);
    return this.http.get(this.apiUrl + '/student', {params: params})
  }
}
