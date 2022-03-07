import {Component, OnInit} from '@angular/core';
import {ForumMainPageBackendService} from "../../../services/aws-lambda/forum-main-page-backend.service";
import {MatDialog} from "@angular/material/dialog";
import {TrainingFormDialogComponent} from "../training-form-dialog/training-form-dialog.component";
import {select, Store} from "@ngrx/store";
import {selectCurrentUserRole} from "../../../ngrx/auth0/auth0.selectors";
import {updateTrainingDataList} from "../../../ngrx/training-data/training-data.action";

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent implements OnInit {
  isRefreshing: boolean;
  isAdmin: boolean;

  constructor(private restful: ForumMainPageBackendService,
              private trainingFormDialog: MatDialog,
              private store: Store<any>) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isRefreshing = false;
    this.isAdmin = false;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    // this.getTrainingList();
    this.store.pipe(select(selectCurrentUserRole)).subscribe({
      next: (userLoginRole) => {
        this.isAdmin = userLoginRole?.includes('Admin');
      }
    })
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
