import {Component, Input, OnInit} from '@angular/core';
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {Training} from "../../../model/Training"
import {MatDialog} from "@angular/material/dialog";
import {TrainingFormDialogComponent} from "../training-form-dialog/training-form-dialog.component";
import {ITraining} from 'src/app/model/interface/ITraining';

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent implements OnInit {
  @Input() trainingList: Array<Training> = [];

  constructor(private restful: AwsLambdaBackendService,
              public trainingFormDialog: MatDialog) {
    console.log(`[${this.constructor.name}] constructor`);
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
  }

  absentBtnOnclick(event: any, training: any, absentReason: any) {
    console.log(`absentBtnOnclick clicked: `, event);
    console.log(`absentBtnOnclick training: `, training);
    console.log(`absentBtnOnclick absentReason: `, absentReason);
    this.removeResponseTraining(training._id);
  }

  removeResponseTraining(trainingId: string) {
    this.trainingList = this.trainingList.filter(function (obj) {
      return obj._id !== trainingId;
    })
  }

  addNewTraining() {
    const dialogRef = this.trainingFormDialog.open(TrainingFormDialogComponent);
    const subscribeDialog = dialogRef.componentInstance.updatedTrainingList
      .subscribe((updatedTrainingList) => {
        console.log(`[${this.constructor.name}] updates list from dialog `, updatedTrainingList);
        updatedTrainingList.forEach((newTraining: ITraining) => {
          this.trainingList.push(newTraining);
        })
      });

    dialogRef.afterClosed().subscribe(result => {
      subscribeDialog.unsubscribe();
    });
  }
}
