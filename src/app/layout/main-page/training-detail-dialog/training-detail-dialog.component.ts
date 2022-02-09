import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ForumBackendService} from "../../../services/aws-lambda/forum-backend.service";
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
  nonReplyStudent: IStudent[] = [];

  leftStudentCol: string[] = ['left'];
  rightStudentCol: string[] = ['right'];
  nonReplyStudentCol: string[] = ['nonReply'];

  isLoading: boolean;
  needUpdateUi: boolean;

  monitoringTrainingUpdate: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogInputData: any,
              private restful: ForumBackendService,
              private trainingDataService: TrainingDataService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isLoading = true;
    this.needUpdateUi = false;
    this.monitoringTrainingUpdate = new Subscription();
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    console.log('clicked data: ', this.dialogInputData.trainingData);
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
    this.restful.getTrainingDetail(this.dialogInputData.trainingData._id).subscribe({
      next: (result) => {
        console.log(`getTrainingDetail result: `, result);
        this.attendLeftStudent = result.reply.leftStudent;
        this.attendRightStudent = result.reply.rightStudent;
        this.nonReplyStudent = result.nonReply;
      },
      complete: () => {
        console.log('getTrainingDetail complete');
        this.isLoading = false;
      }
      }
    );
  }
}
