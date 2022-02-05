import {Component, OnInit} from '@angular/core';
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {MatDialog} from "@angular/material/dialog";
import {TrainingFormDialogComponent} from "../training-form-dialog/training-form-dialog.component";
import {Auth0Service} from "../../../services/auth0.service";
import {TrainingDataService} from "../../../services/training-data.service";

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent implements OnInit {
  isLoading: boolean;
  isAdmin: boolean;

  constructor(private restful: AwsLambdaBackendService,
              private trainingFormDialog: MatDialog,
              private auth0: Auth0Service,
              private trainingDataListService: TrainingDataService) {
    console.log(`[${this.constructor.name}] constructor`);
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
    this.restful.getTrainingList().subscribe({
        next: (result) => {
          console.log(`getTrainingList: `, result);
          this.trainingDataListService.updateTrainingDataList(result);
        },
        complete: () => this.isLoading = false
      }
    );
    this.isLoading = false;
  }

  addNewTrainingToDB() {
    this.trainingFormDialog.open(TrainingFormDialogComponent);
  }
}
