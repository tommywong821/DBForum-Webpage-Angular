import {Component, OnDestroy, OnInit} from '@angular/core';
import {ForumBackendService} from "../../../services/aws-lambda/forum-backend.service";
import {MatDialog} from "@angular/material/dialog";
import {TrainingDetailDialogComponent} from "../training-detail-dialog/training-detail-dialog.component";
import {DateUtil} from "../../../services/date-util.service";
import {TrainingDataService} from "../../../services/training-data.service";
import {Subscription} from "rxjs";
import {Auth0DataService} from "../../../services/auth0-data.service";

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
  isAdmin: boolean;

  monitoringTrainingUpdate: Subscription;

  constructor(private restful: ForumBackendService,
              private trainingDialog: MatDialog,
              public dateUtil: DateUtil,
              private trainingDataService: TrainingDataService,
              private auth0Service: Auth0DataService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.monitoringTrainingUpdate = new Subscription();
    this.isLoading = false;
    this.isAdmin = this.auth0Service.loginRole.includes('Admin');
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.refreshTrainingSummary(false);
    this.monitoringTrainingUpdate = this.trainingDataService.trainingNeedRefresh.subscribe((needRefresh) => {
      if (needRefresh) {
        this.refreshTrainingSummary(false);
      }
    });
  }

  ngOnDestroy() {
    this.monitoringTrainingUpdate.unsubscribe();
  }

  public displayPeopleNo(numberOfPeople: any): number {
    return (numberOfPeople && numberOfPeople > 0) ? numberOfPeople : 0;
  }

  refreshTrainingSummary(showHistory: boolean) {
    this.isLoading = true;
    this.restful.getTrainingSummary(showHistory).subscribe({
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
}
