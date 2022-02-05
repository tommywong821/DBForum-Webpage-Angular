import {Component, OnDestroy, OnInit} from '@angular/core';
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {MatDialog} from "@angular/material/dialog";
import {TrainingDetailDialogComponent} from "../training-detail-dialog/training-detail-dialog.component";
import {DateUtil} from "../../../services/date-util.service";
import {TrainingDataService} from "../../../services/training-data.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-training-summary',
  templateUrl: './training-summary.component.html',
  styleUrls: ['./training-summary.component.scss']
})
export class TrainingSummaryComponent implements OnInit, OnDestroy {

  displayDataList: any
  /*= [{
  "_id": "61fc018cc9384440c093ed62",
  "date": "2022/02/03 00:23",
  "place": "TKO",
  "type": "Water",
  "paddle_side": "left",
  "status": "absent",
  "left_side_paddle": 0,
  "right_side_paddle": 0
}, {
  "_id": "61fc00a6c9384440c093ed61",
  "date": "2022/02/07 18:45",
  "place": "Wanchai Competition",
  "type": "Water",
  "paddle_side": "left",
  "status": "absent",
  "left_side_paddle": 0,
  "right_side_paddle": 0
}];*/
  displayColumns: string[] = ['Date', 'Training Type', 'Training Place', 'L/R'];
  isLoading: boolean = false;

  monitoringTrainingUpdate: Subscription;

  constructor(private restful: AwsLambdaBackendService,
              private trainingDialog: MatDialog,
              private dateUtil: DateUtil,
              private trainingDataService: TrainingDataService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.monitoringTrainingUpdate = new Subscription();
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.getTrainingSummary();
    this.monitoringTrainingUpdate = this.trainingDataService.trainingNeedRefresh.subscribe((needRefresh) => {
      if (needRefresh) {
        this.getTrainingSummary();
      }
    });
  }

  ngOnDestroy() {
    this.monitoringTrainingUpdate.unsubscribe();
  }

  public displayPeopleNo(numberOfPeople: any): number {
    return (numberOfPeople && numberOfPeople > 0) ? numberOfPeople : 0;
  }

  getTrainingSummary() {
    this.isLoading = true;
    this.restful.getTrainingSummary().subscribe({
        next: result => {
          this.displayDataList = result
        },
        complete: () => {
          this.isLoading = false
        }
      }
    );
    this.isLoading = false;
  }

  getTrainingDetail(row: any) {
    console.log(`getTrainingDetail: `, row);
    this.trainingDialog.open(TrainingDetailDialogComponent, {
      data: {
        trainingData: row
      },
      height: '100%',
      width: '100%'
    });
  }

  displayDateFormat(date: any) {
    return this.dateUtil.displayFormat(date);
  }
}
