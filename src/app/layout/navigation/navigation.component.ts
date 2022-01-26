import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {AuthService} from "@auth0/auth0-angular";
import {DOCUMENT} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {SidenavService} from "../../services/sidenav.service";
import {MatSidenav} from "@angular/material/sidenav";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  @ViewChild('sidenav') public sidenav: MatSidenav | any;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        //display menu icon depend on screen side
        // return result.matches

        //display menu icon all the time
        return true;
      }),
      shareReplay()
    );
  isMenuClick: boolean;
  loginUsername: string;

  constructor(private breakpointObserver: BreakpointObserver,
              public auth: AuthService,
              @Inject((DOCUMENT)) public document: Document,
              public profileDialog: MatDialog,
              private sidenavService: SidenavService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isMenuClick = false;
    this.loginUsername = '';
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.auth.user$.subscribe({
      next: (user) => {
        if (user) {
          this.loginUsername = user['http://demozero.net/username'];
        }
      },
      complete: () => {
        localStorage.setItem(environment.usernameKey, this.loginUsername);
      }
    });
  }

  ngAfterViewInit(): void {
    console.log(`[${this.constructor.name}] ngAfterViewInit`);
    this.sidenavService.setSidenav(this.sidenav);
  }
}
