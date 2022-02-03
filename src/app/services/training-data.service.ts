import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrainingDataService {

  trainingNeedRefresh: EventEmitter<boolean>

  constructor() {
    this.trainingNeedRefresh = new EventEmitter();
  }

  needRefresh() {
    this.trainingNeedRefresh.emit(true);
  }
}
