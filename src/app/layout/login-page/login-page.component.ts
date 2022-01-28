import {Component, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(public auth: AuthService) {
  }

  ngOnInit(): void {
    // this.auth.loginWithRedirect({appState: {target: '/mainpage'}})
  }
}
