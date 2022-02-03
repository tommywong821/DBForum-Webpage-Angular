import {Component, OnInit} from '@angular/core';
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {MatDialog} from "@angular/material/dialog";
import {TrainingFormDialogComponent} from "../training-form-dialog/training-form-dialog.component";
import {ITraining} from "../../../model/interface/ITraining";
import {Auth0Service} from "../../../services/auth0.service";

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent implements OnInit {
  trainingList: Array<ITraining>;
  isLoading: boolean;
  isAdmin: boolean;

  constructor(private restful: AwsLambdaBackendService,
              public trainingFormDialog: MatDialog,
              private auth0: Auth0Service) {
    console.log(`[${this.constructor.name}] constructor`);
    this.trainingList = [];
    this.isLoading = true;
    this.isAdmin = false;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.getTrainingList();
    this.isAdmin = this.auth0.loginRole.includes('Admin');
  }

  getTrainingList() {
    this.isLoading = true;
    // this.trainingList = this.restful.getTrainingList();
    this.restful.getTrainingList().subscribe({
        next: (result) => this.trainingList = result,
        complete: () => this.isLoading = false
      }
    );
    this.isLoading = false;
  }

  addNewTrainingToDB() {
    const dialogRef = this.trainingFormDialog.open(TrainingFormDialogComponent);
    const subscribeDialog = dialogRef.componentInstance.updatedTrainingList
      .subscribe((updatedTrainingList) => {
        console.log(`[${this.constructor.name}] updates list from dialog `, updatedTrainingList);
        this.trainingList = this.trainingList.concat(updatedTrainingList);
      });

    dialogRef.afterClosed().subscribe(result => {
      subscribeDialog.unsubscribe();
    });
  }
}
