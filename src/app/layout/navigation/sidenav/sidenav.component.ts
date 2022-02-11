import {Component, OnInit} from '@angular/core';
import {Auth0DataService} from "../../../services/auth0-data.service";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  isAdmin: boolean;

  constructor(private auth0DataService: Auth0DataService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isAdmin = false;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.auth0DataService.stateChanged.subscribe({
      next: (isDataFetched: boolean) => {
        if (isDataFetched) {
          this.isAdmin = this.auth0DataService.loginRole.includes('Admin');
        }
      }
    });
  }

}
