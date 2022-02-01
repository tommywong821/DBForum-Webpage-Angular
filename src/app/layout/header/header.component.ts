import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ProfileDialogComponent} from "./profile-dialog/profile-dialog.component";
import {SidenavService} from "../../services/sidenav.service";
import {Observable} from "rxjs";
import {Auth0Service} from "../../services/auth0.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() isHandset$: Observable<boolean>;

  showBtn: boolean;

  constructor(public auth0: Auth0Service,
              private profileDialog: MatDialog,
              private sidenavService: SidenavService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.showBtn = true;
    this.isHandset$ = new Observable<boolean>();
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
  }

  openProfileDialog() {
    this.profileDialog.open(ProfileDialogComponent, {
      data: {
        itsc: this.auth0.loginUserItsc
      },
      disableClose: true
    });
  }

  toggleSideNav() {
    this.sidenavService.toggle();
  }
}
