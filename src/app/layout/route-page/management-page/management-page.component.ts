import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {selectCurrentUserRole} from "../../../ngrx/auth0/auth0.selectors";

@Component({
  selector: 'app-management-page',
  templateUrl: './management-page.component.html',
  styleUrls: ['./management-page.component.scss']
})
export class ManagementPageComponent implements OnInit {

  isAdmin: boolean;

  constructor(private store: Store<any>) {
    console.log(`[${this.constructor.name}] constructor`);

    this.isAdmin = false;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.store.pipe(select(selectCurrentUserRole)).subscribe({
      next: (userLoginRole) => {
        if (userLoginRole) {
          this.isAdmin = userLoginRole.includes('Admin');
        }
      },
    });
  }

  //todo add update student grad year and is active team member value
}
