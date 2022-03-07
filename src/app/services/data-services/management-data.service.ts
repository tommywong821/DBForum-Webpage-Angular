import {Injectable} from '@angular/core';
import {IStudentAccount} from "../../model/auth0-management/IStudentAccount";
import {IUserRole} from "../../model/auth0-management/IUserRole";

@Injectable({
  providedIn: 'root'
})
export class ManagementDataService {

  constructor() {
    this._studentAccountCsv = "";
    this._studentAccountList = new Array<IStudentAccount>();
    this._userRoleList = new Array<IUserRole>();
  }

  private _studentAccountCsv: string;
  private _studentAccountList: Array<IStudentAccount>

  get studentAccountList(): Array<IStudentAccount> {
    return this._studentAccountList;
  }

  get studentAccountCsv(): string {
    return this._studentAccountCsv;
  }

  set studentAccountCsv(value: string) {
    this._studentAccountCsv = value;
  }

  set studentAccountList(value: Array<IStudentAccount>) {
    this._studentAccountList = value;
  }

  private _userRoleList: Array<IUserRole>

  get userRoleList(): Array<IUserRole> {
    return this._userRoleList;
  }

  set userRoleList(value: Array<IUserRole>) {
    this._userRoleList = value;
  }
}
