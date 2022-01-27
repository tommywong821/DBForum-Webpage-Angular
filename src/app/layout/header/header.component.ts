import {Component, Inject, Input, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {DOCUMENT} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {ProfileDialogComponent} from "./profile-dialog/profile-dialog.component";
import {SidenavService} from "../../services/sidenav.service";
import {filter, Observable} from "rxjs";
import {NavigationEnd, Router, RouterEvent} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() isHandset$: Observable<boolean>;

  loginUsername: string;
  showBtn: boolean;

  constructor(public auth: AuthService,
              @Inject((DOCUMENT)) public document: Document,
              public profileDialog: MatDialog,
              private sidenavService: SidenavService,
              private router: Router) {
    console.log(`[${this.constructor.name}] constructor`);
    this.loginUsername = '';
    this.showBtn = true;
    this.isHandset$ = new Observable<boolean>();
  }

  subscribeRouterEvents = () => {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((event) => {
      if (event instanceof RouterEvent) {
        if (event.url === '/login') {
          this.showBtn = false;
        }
      }
    });
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.initUsername();
    this.subscribeRouterEvents();
  }

  openProfileDialog() {
    this.profileDialog.open(ProfileDialogComponent, {
      data: {
        username: this.loginUsername
      },
      disableClose: true
    });
  }

  toggleSideNav() {
    console.log('toggle sidenav');
    this.sidenavService.toggle();
  }

  initUsername() {
    this.auth.user$.subscribe((user) => {
      if (user) {
        this.loginUsername = user['http://demozero.net/username'];
      }
    });
  }
}
