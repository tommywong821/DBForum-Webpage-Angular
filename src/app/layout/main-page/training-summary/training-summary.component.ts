import {Component, OnInit} from '@angular/core';
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {MatDialog} from "@angular/material/dialog";
import {TrainingDetailDialogComponent} from "../training-detail-dialog/training-detail-dialog.component";
import {DateUtil} from "../../../services/date-util.service";

@Component({
  selector: 'app-training-summary',
  templateUrl: './training-summary.component.html',
  styleUrls: ['./training-summary.component.scss']
})
export class TrainingSummaryComponent implements OnInit {

  displayDataList: any = [];
  displayColumns: string[] = ['Date', 'Training Type', 'Training Place', 'L/R'];
  isLoading: boolean = true;

  constructor(private restful: AwsLambdaBackendService,
              public trainingDialog: MatDialog,
              public dateUtil: DateUtil) {
    console.log(`[${this.constructor.name}] constructor`);
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.getTrainingSummary();
  }

  public displayPeopleNo(numberOfPeople: any): number {
    return (numberOfPeople && numberOfPeople > 0) ? numberOfPeople : 0;
  }

  getTrainingSummary() {
    this.isLoading = true;
    this.displayDataList = this.restful.getTrainingSummary();
    // this.restful.getTrainingSummary().subscribe({
    //     next: result => {
    //       this.displayDataList = result
    //     },
    //     complete: () => {
    //       this.isLoading = false
    //     }
    //   }
    // );
    this.isLoading = false;
  }

  getTrainingDetail(row: any) {
    console.log(`getTrainingDetail: `, row);
    this.trainingDialog.open(TrainingDetailDialogComponent, {
      data: {
        rawData: row
      },
      height: '100%',
      width: '100%'
    });
  }
}
