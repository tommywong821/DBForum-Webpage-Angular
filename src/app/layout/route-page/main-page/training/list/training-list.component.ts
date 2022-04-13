import {Component, OnInit} from '@angular/core';
import {ForumBackendMainpageService} from "../../../../../services/aws-lambda/forum-backend-mainpage.service";
import {MatDialog} from "@angular/material/dialog";
import {TrainingFormDialogComponent} from "../form-dialog/training-form-dialog.component";
import {select, Store} from "@ngrx/store";
import {selectCurrentUserRole} from "../../../../../ngrx/auth0/auth0.selectors";
import {updateTrainingDataList} from "../../../../../ngrx/training-data/training-data.action";
import {environment} from "../../../../../../environments/environment";

@Component({
  selector: 'app-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent implements OnInit {
  isRefreshing: boolean;
  isAdmin: boolean;
  isActiveTeamMember: boolean;

  constructor(private restful: ForumBackendMainpageService,
              private trainingFormDialog: MatDialog,
              private store: Store<any>) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isRefreshing = false;
    this.isAdmin = false;
    this.isActiveTeamMember = false;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    // this.getTrainingList();
    this.store.pipe(select(selectCurrentUserRole)).subscribe({
      next: (userLoginRole) => {
        this.isAdmin = userLoginRole?.includes('Admin');
      }
    })
    //check from local session storage
    const studentProfileString: any = sessionStorage.getItem(environment.studentProfileKey);
    if (studentProfileString) {
      const studentProfileObj: any = JSON.parse(studentProfileString);
      this.isActiveTeamMember = studentProfileObj.is_active_team_member
    }
  }

  getTrainingList() {
    this.isRefreshing = true;
    this.restful.getTrainingList().subscribe({
        next: (trainingList) => {
          console.log(`getTrainingList: `, trainingList);
          this.store.dispatch(updateTrainingDataList({trainingList: trainingList}));
          this.isRefreshing = false;
        }
      }
    );
  }

  addNewTrainingToDB() {
    this.trainingFormDialog.open(TrainingFormDialogComponent);
  }
}
