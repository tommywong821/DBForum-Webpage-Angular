import {Component, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {Auth0Service} from "../../services/auth0.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  isLogined: boolean;

  constructor(private auth: AuthService,
              private auth0: Auth0Service) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isLogined = false;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.auth.isAuthenticated$.subscribe({
      next: (isAuthenticated) => {
        console.log(`login state: `, isAuthenticated)
        if (isAuthenticated) {
          this.storeLoginInfo();
          this.isLogined = true;
        } else {
          this.auth.loginWithRedirect();
        }
      }
    });
  }

  storeLoginInfo(): void {
    this.auth.user$.subscribe({
      next: (user) => {
        console.log(`storeLoginInfo: `, user);
        if (user) {
          this.auth0.loginUsername = user['http://demozero.net/username'];
          this.auth0.loginRole = user['http://demozero.net/roles'];
          this.auth0.isAuthenticated = true;
        }
      },
      complete: () => {
      }
    });
  }
}
