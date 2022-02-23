import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {selectIsLoggedIn} from "../../ngrx/auth0/auth0.selectors";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  loggedIn$: Observable<boolean>;

  constructor(private store: Store<any>) {
    console.log(`[${this.constructor.name}] constructor`);
    this.loggedIn$ = this.store.pipe(select(selectIsLoggedIn));
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
  }
}
