import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {Attendance} from "../../../model/Attendance";
import {Student} from "../../../model/Student";

@Component({
  selector: 'app-training-detail-dialog',
  templateUrl: './training-detail-dialog.component.html',
  styleUrls: ['./training-detail-dialog.component.scss']
})
export class TrainingDetailDialogComponent implements OnInit {

  attendLeftStudent: Student[] = [];
  attendRightStudent: Student[] = [];
  nonReplayStudnet: Student[] = [];

  displayedColumns: string[] = ['left'];
  displayedColumns2: string[] = ['right'];
  displayedColumns3: string[] = ['nonReplay'];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogInputData: any,
              private restful: AwsLambdaBackendService) {
    console.log(`[${this.constructor.name}] constructor`);
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    console.log('clicked data: ', this.dialogInputData);
    let allReplayMap = new Map<string, any>();
    let repliedMap = new Map<string, Student[]>();
    let leftSideList: Student[] = [];
    let rightSideList: Student[] = [];
    let nonReplyList: Student[] = [];
    this.restful.getTrainingDetail(this.dialogInputData.rawData._id).subscribe({
        next: (result) => {
          let trainingDetailResponse = result[0];
          let nonReplyStudentList = result[1];
          console.log(`getTrainingDetail: `, result);
          trainingDetailResponse.forEach((attandace: Attendance) => {
            let student = new Student(attandace.student_id);
            student.reason = attandace.reason;
            student.status = attandace.status;
            //replied student
            if ("attend" === student.status || "late replay" === student.status) {
              if ('left' === student.paddle_side?.toLowerCase()) {
                leftSideList.push(student);
              } else {
                rightSideList.push(student);
              }
            } else {
              //not yet replied student
              nonReplyList.push(student);
            }
          });
          repliedMap.set('leftStudent', leftSideList);
          repliedMap.set('rightStudent', rightSideList);

          allReplayMap.set('reply', repliedMap);
          allReplayMap.set('nonReply', nonReplyList.concat(nonReplyStudentList));
          console.log(`studentMap: `, allReplayMap);
          this.attendLeftStudent = allReplayMap.get('reply').get('leftStudent');
          this.attendRightStudent = allReplayMap.get('reply').get('rightStudent');
          this.nonReplayStudnet = allReplayMap.get('nonReply');
        },
        complete: () => console.log('complete')
      }
    );
  }

}
