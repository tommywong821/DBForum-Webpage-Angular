import {Component, OnInit} from '@angular/core';
import {Auth0Service} from "../../../services/auth0.service";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  isAdmin: boolean;

  constructor(private auth0: Auth0Service) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isAdmin = false;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.isAdmin = this.auth0.loginRole.includes('Admin');
  }
}
