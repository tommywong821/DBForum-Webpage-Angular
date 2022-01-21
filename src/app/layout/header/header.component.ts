import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {DOCUMENT} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {ProfileDialogComponent} from "./profile-dialog/profile-dialog.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loginUsername: string;

  constructor(public auth: AuthService,
              @Inject((DOCUMENT)) public document: Document,
              public profileDialog: MatDialog) {
    console.log(`[${this.constructor.name}] constructor`);
    this.loginUsername = '';
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.auth.user$.subscribe((user) => {
      if (user) {
        this.loginUsername = user['http://demozero.net/username'];
      }
    });
  }

  openProfileDialog() {
    this.profileDialog.open(ProfileDialogComponent, {
      data: {
        username: this.loginUsername
      },
      disableClose: true
    });
  }
}
