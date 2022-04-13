import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {selectIsLoaded} from "./training-data.selector";
import {combineLatest, filter, map, of, switchMap, withLatestFrom} from "rxjs";
import {ForumBackendMainpageService} from "../../services/aws-lambda/forum-backend-mainpage.service";

import * as trainingDataAction from './training-data.action';
import {ITraining} from "../../model/forum/ITraining";

@Injectable()
export class TrainingDataEffect {
  constructor(private action$: Actions,
              private store: Store<any>,
              private restful: ForumBackendMainpageService) {
  }

  getTrainingDataList$ = createEffect(() =>
    this.action$.pipe(
      ofType(trainingDataAction.getTrainingDataList),
      withLatestFrom(this.store.select(selectIsLoaded)),
      filter(([action, isLoaded]) => !isLoaded),
      switchMap(() =>
        combineLatest([this.restful.getTrainingList()]),
      ),
      switchMap(([trainingList]) => {
        const isLoaded: boolean = true;
        return of(trainingDataAction.getTrainingDataListComplete({isLoaded, trainingList}));
      })
    )
  )

  updateTrainingDataList$ = createEffect(() =>
    this.action$.pipe(
      ofType(trainingDataAction.updateTrainingDataList),
      map(action => ({
        type: action.type,
        payload: action.trainingList
      })),
      switchMap((action) => {
        const isLoaded: boolean = true;
        const trainingList: Array<ITraining> = action.payload;
        return of(trainingDataAction.getTrainingDataListComplete({isLoaded, trainingList}));
      })
    )
  )
}
