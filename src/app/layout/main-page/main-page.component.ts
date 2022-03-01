import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {selectIsLoggedIn} from "../../ngrx/auth0/auth0.selectors";
import {selectTrainingDataList} from "../../ngrx/training-data/training-data.selector";
import {getTrainingDataList} from "../../ngrx/training-data/training-data.action";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  loggedIn$: Observable<boolean>;
  trainingList$: Observable<any>;
  trainingList2$: Observable<any>;

  constructor(private store: Store<any>) {
    console.log(`[${this.constructor.name}] constructor`);
    this.loggedIn$ = this.store.pipe(select(selectIsLoggedIn));
    this.store.dispatch(getTrainingDataList());
    this.trainingList$ = this.store.pipe(select(selectTrainingDataList));
    this.trainingList2$ = this.store.pipe(select(selectIsLoggedIn));
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
  }
}
