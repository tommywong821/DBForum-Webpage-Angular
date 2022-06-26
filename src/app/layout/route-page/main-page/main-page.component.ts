import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {selectCurrentUserRole, selectIsLoggedIn} from "../../../ngrx/auth0/auth0.selectors";
import {selectTrainingDataList} from "../../../ngrx/training-data/training-data.selector";
import {getTrainingDataList} from "../../../ngrx/training-data/training-data.action";
import {combineLatest} from "rxjs";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  loggedIn: boolean;
  isAdmin: boolean;

  constructor(private store: Store<any>) {
    this.loggedIn = false;
    this.isAdmin = false;
    console.log(`[${this.constructor.name}] constructor`);
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    combineLatest([
      this.store.pipe(select(selectIsLoggedIn)),
      this.store.pipe(select(selectCurrentUserRole)),
      this.store.pipe(select(selectTrainingDataList))
    ]).subscribe({
      next: ([isLoggedIn, userLoginRole]) => {
        if (isLoggedIn) {
          this.loggedIn = isLoggedIn;
          this.store.dispatch(getTrainingDataList());
        }
        if (userLoginRole) {
          this.isAdmin = userLoginRole?.includes('Admin');
        }
      }
    });
  }
}
