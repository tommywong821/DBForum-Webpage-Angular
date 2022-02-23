import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ProfileDialogComponent} from "./profile-dialog/profile-dialog.component";
import {SidenavService} from "../../services/sidenav.service";
import {combineLatest, Observable} from "rxjs";
import {ForumBackendService} from "../../services/aws-lambda/forum-backend.service";
import {IStudent} from "../../model/forum/IStudent";
import {select, Store} from "@ngrx/store";
import {logout} from 'src/app/ngrx/auth0/auth0.action';
import {selectCurrentUserItsc, selectIsLoggedIn} from "../../ngrx/auth0/auth0.selectors";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() isHandset$: Observable<boolean>;

  showBtn: boolean;
  studentDetail: IStudent = {
    _id: '',
    date_of_birth: '',
    gender: '',
    paddle_side: '',
    weight: 0,
    itsc: '',
    updated_at: '',
    created_at: '',
    email: '',
    nickname: ''
  };
  isLoggedIn$: Observable<boolean>;
  loginUserItsc$: Observable<any>;

  constructor(private profileDialog: MatDialog,
              private sidenavService: SidenavService,
              private restful: ForumBackendService,
              private store: Store<any>) {
    console.log(`[${this.constructor.name}] constructor`);
    this.showBtn = true;
    this.isHandset$ = new Observable<boolean>();
    this.isLoggedIn$ = this.store.pipe(select(selectIsLoggedIn));
    this.loginUserItsc$ = this.store.pipe(select(selectCurrentUserItsc));
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    combineLatest([this.isLoggedIn$, this.loginUserItsc$]).subscribe({
      next: ([isLoggedIn, itsc]) => {
        if (isLoggedIn && itsc) {
          this.restful.getStudentDetail(itsc).subscribe({
            next: (result) => {
              console.log(`getStudentDetail: `, result);
              if (result) {
                this.studentDetail = result;
              } else {
                alert(`Please fill in your information`);
                this.studentDetail.itsc = itsc;
                this.openProfileDialog();
              }
            }
          });
        }
      }
    });
  }

  openProfileDialog() {
    this.profileDialog.open(ProfileDialogComponent, {
      data: {
        studentDetail: this.studentDetail
      },
      disableClose: true
    });
  }

  toggleSideNav() {
    this.sidenavService.toggle();
  }

  logout() {
    this.store.dispatch(logout());
  }
}
