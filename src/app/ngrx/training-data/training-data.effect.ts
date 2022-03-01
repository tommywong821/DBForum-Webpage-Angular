import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {selectIsLoaded} from "./training-data.selector";
import {combineLatest, filter, of, switchMap, withLatestFrom} from "rxjs";
import {ForumMainPageBackendService} from "../../services/aws-lambda/forum-main-page-backend.service";

import * as trainingDataAction from './training-data.action';

@Injectable()
export class TrainingDataEffect {
  constructor(private action$: Actions,
              private store: Store<any>,
              private restful: ForumMainPageBackendService) {
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
}
