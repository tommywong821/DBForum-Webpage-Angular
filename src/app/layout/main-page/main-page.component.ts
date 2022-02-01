import {Component, OnInit} from '@angular/core';
import {Auth0Service} from "../../services/auth0.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  isLogined: boolean;

  constructor(private auth0: Auth0Service) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isLogined = false;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.auth0.stateChanged.subscribe({
      next: (isDataFetched: boolean) => {
        if (isDataFetched) {
          this.isLogined = this.auth0.isAuthenticated;
        }
      }
    });
  }
}
