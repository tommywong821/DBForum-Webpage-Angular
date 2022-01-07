import {Component, Input, OnInit} from '@angular/core';
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {Training} from "../../../model/Training"
import {MatDialog} from "@angular/material/dialog";

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
    // const dialogRef = this.trainingFormDialog.open()
/* todo move to add training dialog
   console.log("clicked addNewTraining btn");
    let newTraining = new Training({
      "_id": '',
      "date": "2022-01-01T16:00:00.000Z",
      "place": "new",
      "type": "new",
      "reason": "new"
    });
    this.restful.createTraining(newTraining).subscribe((response) => {
      this.trainingList.push(newTraining);
    })*/
  }
}
