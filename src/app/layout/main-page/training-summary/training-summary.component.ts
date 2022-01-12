import {Component, OnInit} from '@angular/core';
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {TrainingSummary} from "../../../model/TrainingSummary";
import {MatDialog} from "@angular/material/dialog";
import {TrainingDetailDialogComponent} from "../training-detail-dialog/training-detail-dialog.component";

const ELEMENT_DATA: any[] = [
  {
    "_id": {
      "_id": "61da742cdfa025471941a6dd",
      "date": "2022-06-01T16:00:00.000Z",
      "place": "ust",
      "type": "land",
      "paddle_side": "L"
    },
    "count": 1
  },
  {
    "_id": {
      "_id": "61d1583aaa03cc7c2869ece4",
      "date": "2022-05-01T16:00:00.000Z",
      "place": "TKO",
      "type": "Water",
      "paddle_side": "L"
    },
    "count": 6
  },
  {
    "_id": {
      "_id": "61d1583aaa03cc7c2869ece4",
      "date": "2022-05-01T16:00:00.000Z",
      "place": "TKO",
      "type": "Water",
      "paddle_side": "R"
    },
    "count": 6
  }
];

@Component({
  selector: 'app-training-summary',
  templateUrl: './training-summary.component.html',
  styleUrls: ['./training-summary.component.scss']
})
export class TrainingSummaryComponent implements OnInit {

  //map _id to TrainingSummary
  groupedTrainingSummary = new Map<string, TrainingSummary>();
  displayDataList: any = [];
  displayColumns: string[] = ['Date', 'Training Place', 'Training Place', 'L/R'];
  isLoading: boolean = true;

  constructor(private restful: AwsLambdaBackendService,
              public trainingDialog: MatDialog) {
    console.log(`[${this.constructor.name}] constructor`);
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.getTrainingSummary();
  }

  public displayPeopleNo(numberOfPeople: any): number {
    return (numberOfPeople && numberOfPeople > 0) ? numberOfPeople : 0;
  }

  private checkPaddleSize(existingTrainingSummary: TrainingSummary, paddle_side: any, numberOfPaddler: any) {
    if ("l" === paddle_side?.toLowerCase()) {
      existingTrainingSummary.left_side_paddle = numberOfPaddler;
    } else {
      existingTrainingSummary.right_side_paddle = numberOfPaddler;
    }
  }

  getTrainingSummary() {
    this.isLoading = true;
    this.restful.getTrainingSummary().subscribe({
        next: result => {
          result.forEach((rawData: { _id: TrainingSummary; count: any; }) => {
            let trainingInfo: TrainingSummary = new TrainingSummary(rawData._id);
            let insertedTrainingInfo = this.groupedTrainingSummary.get(trainingInfo._id);

            if (insertedTrainingInfo) {
              this.checkPaddleSize(insertedTrainingInfo, trainingInfo.paddle_side, rawData.count);
            } else {
              this.checkPaddleSize(trainingInfo, trainingInfo.paddle_side, rawData.count);
              this.groupedTrainingSummary.set(trainingInfo._id, trainingInfo);
            }
          });
          this.displayDataList = Array.from(this.groupedTrainingSummary.values());
          console.log(`after ngOnInit: `, this.displayDataList);
        },
        complete: () => this.isLoading = false
      }
    );
  }

  getTrainingDetail(row: any) {
    console.log(`getTrainingDetail: `, row);
    this.trainingDialog.open(TrainingDetailDialogComponent);
  }
}
