import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ProfileDialogComponent} from "./profile-dialog/profile-dialog.component";
import {SidenavService} from "../../services/sidenav.service";
import {Observable} from "rxjs";
import {Auth0DataService} from "../../services/auth0-data.service";
import {ForumBackendService} from "../../services/aws-lambda/forum-backend.service";
import {IStudent} from "../../model/forum/IStudent";

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

  constructor(public auth0DataService: Auth0DataService,
              private profileDialog: MatDialog,
              private sidenavService: SidenavService,
              private restful: ForumBackendService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.showBtn = true;
    this.isHandset$ = new Observable<boolean>();
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.auth0DataService.stateChanged.subscribe((isChanged) => {
      if(isChanged){
        this.restful.getStudentDetail(this.auth0DataService.loginUserItsc).subscribe({
          next: (result) => {
            console.log(`getStudentDetail: `, result);
            if (result) {
              this.studentDetail = result;
            } else {
              alert(`Please fill in your information`);
              this.studentDetail.itsc = this.auth0DataService.loginUserItsc;
              this.openProfileDialog();
            }
          }
        });
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
}
