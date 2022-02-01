import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {AuthService} from "@auth0/auth0-angular";
import {DOCUMENT} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {SidenavService} from "../../services/sidenav.service";
import {MatSidenav} from "@angular/material/sidenav";
import {Auth0Service} from "../../services/auth0.service";

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

  constructor(private breakpointObserver: BreakpointObserver,
              public auth: AuthService,
              @Inject((DOCUMENT)) public document: Document,
              public profileDialog: MatDialog,
              private sidenavService: SidenavService,
              private auth0: Auth0Service) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isMenuClick = false;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.auth.isAuthenticated$.subscribe({
      next: (isAuthenticated) => {
        console.log(`login state: `, isAuthenticated)
        if (isAuthenticated) {
          this.storeLoginInfo();
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
          this.auth0.initUserData(user);
        }
      },
      complete: () => {
      }
    });
  }

  ngAfterViewInit(): void {
    console.log(`[${this.constructor.name}] ngAfterViewInit`);
    this.sidenavService.setSidenav(this.sidenav);
  }
}
