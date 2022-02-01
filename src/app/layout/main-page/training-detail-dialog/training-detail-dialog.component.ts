import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";

import {environment} from "../../../../environments/environment";
import {IStudent} from "../../../model/interface/IStudent";

@Component({
  selector: 'app-training-detail-dialog',
  templateUrl: './training-detail-dialog.component.html',
  styleUrls: ['./training-detail-dialog.component.scss']
})
export class TrainingDetailDialogComponent implements OnInit {

  env = environment;

  attendLeftStudent: IStudent[] = [];
  attendRightStudent: IStudent[] = [];
  nonReplyStudent: IStudent[] = [];

  leftStudentCol: string[] = ['left'];
  rightStudentCol: string[] = ['right'];
  nonReplyStudentCol: string[] = ['nonReply'];

  isLoading: boolean;
  needUpdateUi: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogInputData: any,
              private restful: AwsLambdaBackendService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isLoading = true;
    this.needUpdateUi = false;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    console.log('clicked data: ', this.dialogInputData);
    this.initTrainingDetail();
  }

  handleNeedRefresh(needRefresh: boolean) {
    console.log(`handleNeedRefresh: `, needRefresh);
    this.initTrainingDetail();
  }

  initTrainingDetail() {
    this.isLoading = true;
    this.restful.getTrainingDetail(this.dialogInputData.rawData._id).subscribe({
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
