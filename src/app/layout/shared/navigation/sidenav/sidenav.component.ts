import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {selectCurrentUserRole} from "../../../../ngrx/auth0/auth0.selectors";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  isAdmin: boolean;

  constructor(private store: Store<any>) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isAdmin = false;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.store.pipe(select(selectCurrentUserRole)).subscribe({
      next: (userLoginRole) => {
        this.isAdmin = userLoginRole?.includes('Admin');
      }
    })
  }

}
