import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {checkAuth} from "./ngrx/auth0/auth0.action";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ustdboat-forum';

  constructor(private store: Store<any>) {
    console.log(`[${this.constructor.name}] constructor`);
    this.store.dispatch(checkAuth());
  }

  ngOnInit() {
    console.log(`[${this.constructor.name}] ngOnInit`);
  }
}
