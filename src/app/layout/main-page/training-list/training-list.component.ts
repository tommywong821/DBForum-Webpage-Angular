import {Component, OnInit} from '@angular/core';
import {ForumBackendService} from "../../../services/aws-lambda/forum-backend.service";
import {MatDialog} from "@angular/material/dialog";
import {TrainingFormDialogComponent} from "../training-form-dialog/training-form-dialog.component";
import {TrainingDataService} from "../../../services/training-data.service";
import {select, Store} from "@ngrx/store";
import {selectCurrentUserRole} from "../../../ngrx/auth0/auth0.selectors";

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent implements OnInit {
  isRefreshing: boolean;
  isAdmin: boolean;

  constructor(private restful: ForumBackendService,
              private trainingFormDialog: MatDialog,
              private trainingDataListService: TrainingDataService,
              private store: Store<any>) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isRefreshing = true;
    this.isAdmin = false;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.getTrainingList();
    this.store.pipe(select(selectCurrentUserRole)).subscribe({
      next: (userLoginRole) => {
        this.isAdmin = userLoginRole?.includes('Admin');
      }
    })
  }

  getTrainingList() {
    this.isRefreshing = true;
    this.restful.getTrainingList().subscribe({
        next: (result) => {
          console.log(`getTrainingList: `, result);
          this.trainingDataListService.updateTrainingDataList(result);
          this.isRefreshing = false;
        }
      }
    );
  }

  addNewTrainingToDB() {
    this.trainingFormDialog.open(TrainingFormDialogComponent);
  }
}
