import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ForumMainPageBackendService} from "../../../services/aws-lambda/forum-main-page-backend.service";
import {IStudent} from "../../../model/forum/IStudent";
import {TrainingDataService} from "../../../services/training-data.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-training-detail-dialog',
  templateUrl: './training-detail-dialog.component.html',
  styleUrls: ['./training-detail-dialog.component.scss']
})
export class TrainingDetailDialogComponent implements OnInit, OnDestroy {

  attendLeftStudent: IStudent[] = [];
  attendRightStudent: IStudent[] = [];
  noReplyStudent: IStudent[] = [];
  absentStudent: IStudent[] = [];

  leftStudentCol: string[] = ['left'];
  rightStudentCol: string[] = ['right'];
  noReplyStudentCol: string[] = ['noReply'];
  absentStudentCol: string[] = ['absent'];

  isLoading: boolean;
  needUpdateUi: boolean;

  monitoringTrainingUpdate: Subscription;

  trainingData: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogInputData: any,
              private restful: ForumMainPageBackendService,
              private trainingDataService: TrainingDataService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isLoading = true;
    this.needUpdateUi = false;
    this.monitoringTrainingUpdate = new Subscription();
    this.trainingData = this.dialogInputData.trainingData;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    console.log('clicked data: ', this.trainingData);
    this.initTrainingDetail();
    this.monitoringTrainingUpdate = this.trainingDataService.trainingNeedRefresh.subscribe((needRefresh) => {
      if (needRefresh) {
        this.initTrainingDetail();
      }
    });
  }

  ngOnDestroy() {
    this.monitoringTrainingUpdate.unsubscribe();
  }

  initTrainingDetail() {
    this.isLoading = true;
    this.restful.getTrainingDetail(this.trainingData.uuid).subscribe({
      next: (result) => {
        console.log(`getTrainingDetail result: `, result);
        this.attendLeftStudent = result.attend.leftStudent;
        this.attendRightStudent = result.attend.rightStudent;
        this.noReplyStudent = result.absent.noReplyStudent;
        this.absentStudent = result.absent.absentStudent;
      },
      complete: () => {
        console.log('getTrainingDetail complete');
        this.isLoading = false;
      }
      }
    );
  }
}
