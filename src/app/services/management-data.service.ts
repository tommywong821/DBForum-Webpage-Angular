import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManagementDataService {

  constructor() {
    this._studentAccountCsv = "";
  }

  private _studentAccountCsv: string;

  get studentAccountCsv(): string {
    return this._studentAccountCsv;
  }

  set studentAccountCsv(value: string) {
    this._studentAccountCsv = value;
  }
}
