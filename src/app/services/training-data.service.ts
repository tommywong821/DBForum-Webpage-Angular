import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ITraining} from "../model/forum/ITraining";

@Injectable({
  providedIn: 'root'
})
export class TrainingDataService {

  trainingNeedRefresh: EventEmitter<boolean>;

  constructor() {
    this.trainingNeedRefresh = new EventEmitter();
    this._trainingDataList = new BehaviorSubject<Array<ITraining>>([]);
  }

  private _trainingDataList: BehaviorSubject<Array<ITraining>>;

  get trainingDataList(): Observable<Array<ITraining>> {
    return this._trainingDataList.asObservable();
  }

  updateTrainingDataList(trainingList: Array<ITraining>): void {
    this._trainingDataList.next(trainingList);
    this._trainingDataList.complete();
  }

  needRefresh() {
    this.trainingNeedRefresh.emit(true);
  }
}
