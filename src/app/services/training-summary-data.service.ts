import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrainingSummaryDataService {

  trainingNeedRefresh: EventEmitter<boolean>;
  private _fromDate: any;
  private _toDate: any;

  constructor() {
    this.trainingNeedRefresh = new EventEmitter();
  }

  get toDate(): any {
    return this._toDate;
  }

  set toDate(value: any) {
    this._toDate = value;
  }

  get fromDate(): any {
    return this._fromDate;
  }

  set fromDate(value: any) {
    this._fromDate = value;
  }

  needRefresh() {
    this.trainingNeedRefresh.emit(true);
  }

  initFromToDate(fromDate: any, toDate: any) {
    this._fromDate = fromDate;
    this._toDate = toDate;
  }
}
