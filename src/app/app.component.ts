import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {checkAuth, login} from "./ngrx/auth0/auth0.action";
import {Observable} from "rxjs";
import {selectIsLoggedIn} from "./ngrx/auth0/auth0.selectors";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ustdboat-forum';
  loggedIn$: Observable<boolean>;

  constructor(private store: Store<any>) {
    console.log(`[${this.constructor.name}] constructor`);
    this.loggedIn$ = this.store.pipe(select(selectIsLoggedIn));

    this.store.dispatch(checkAuth());
  }

  ngOnInit() {
    console.log(`[${this.constructor.name}] ngOnInit`);

    this.loggedIn$.subscribe({
      next: (isLoggedIn) => {
        if (!isLoggedIn) {
          this.store.dispatch(login());
        }
      }
    })
  }
}
