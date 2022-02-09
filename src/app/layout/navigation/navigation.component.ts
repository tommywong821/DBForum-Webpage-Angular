import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {combineLatest, mergeMap, Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {AuthService} from "@auth0/auth0-angular";
import {DOCUMENT} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {SidenavService} from "../../services/sidenav.service";
import {MatSidenav} from "@angular/material/sidenav";
import {Auth0DataService} from "../../services/auth0-data.service";

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
  auth0Login$: Observable<any>;
  auth0Token$: Observable<any>;

  constructor(private breakpointObserver: BreakpointObserver,
              public auth: AuthService,
              @Inject((DOCUMENT)) public document: Document,
              public profileDialog: MatDialog,
              private sidenavService: SidenavService,
              private auth0DataService: Auth0DataService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isMenuClick = false;
    this.auth0Login$ = this.auth.isAuthenticated$.pipe(
      mergeMap((isAuthenticated) => {
        if (isAuthenticated) {
          return this.auth.user$;
        } else {
          return this.auth.loginWithRedirect();
        }
      })
    );
    this.auth0Token$ = this.auth.idTokenClaims$;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    combineLatest([this.auth0Login$, this.auth0Token$]).subscribe(([user, accessToken]) => {
      if (user && accessToken) {
        this.auth0DataService.initUserData(user, accessToken.__raw);
      }

    });
  }

  ngAfterViewInit(): void {
    console.log(`[${this.constructor.name}] ngAfterViewInit`);
    this.sidenavService.setSidenav(this.sidenav);
  }
}
