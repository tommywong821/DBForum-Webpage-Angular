import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ForumMainPageBackendService} from "../../../../services/aws-lambda/forum-main-page-backend.service";
import {IStudent} from "../../../../model/forum/IStudent";
import {TrainingSummaryDataService} from "../../../../services/data-services/training-summary-data.service";
import {Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";
import {selectCurrentUserRole} from "../../../../ngrx/auth0/auth0.selectors";
import {SelectionModel} from "@angular/cdk/collections";
import {ITraining} from "../../../../model/forum/ITraining";

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
  isAdmin: boolean;

  selection = new SelectionModel<any>(true, []);
  noShowStudentIdList: string[] = [];
  showUpStudentIdList: string[] = [];

  monitoringTrainingUpdate: Subscription;

  trainingData: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogInputData: any,
              private restful: ForumMainPageBackendService,
              private trainingDataService: TrainingSummaryDataService,
              private store: Store<any>,
              private dialogRef: MatDialogRef<TrainingDetailDialogComponent>) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isLoading = true;
    this.needUpdateUi = false;
    this.monitoringTrainingUpdate = new Subscription();
    this.trainingData = this.dialogInputData.trainingData;
    this.isAdmin = false;
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
    this.store.pipe(select(selectCurrentUserRole)).subscribe({
      next: userLoginRole => {
        this.isAdmin = userLoginRole.includes('Admin');
        if (this.isAdmin) {
          this.leftStudentCol.push('leftNoShow');
          this.rightStudentCol.push('rightNoShow');
        }
      }
    })
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

  handleNoShowSelection(student: any, $event: any) {
    console.log(`row: `, student);
    console.log(`$event: `, $event);
    console.log(`$event.checked: `, $event.checked);
    //add to list
    if ($event.checked && !this.noShowStudentIdList.find(studentId => studentId == student.uuid)) {
      this.showUpStudentIdList = this.showUpStudentIdList.filter((studentId) => studentId != student.uuid);
      this.noShowStudentIdList.push(student.uuid);
    } else if (!$event.checked && !this.showUpStudentIdList.find(studentId => studentId == student.uuid)) {
      this.showUpStudentIdList.push(student.uuid);
      this.noShowStudentIdList = this.noShowStudentIdList.filter((studentId) => studentId != student.uuid);
    }
    console.log(`noShowStudentIdList: `, this.noShowStudentIdList);
    console.log(`showUpStudentIdList: `, this.showUpStudentIdList);
  }

  updateNoShowAttendance() {
    if (this.noShowStudentIdList.length < 1 && this.showUpStudentIdList.length < 1) {
      alert("Please select student(s) to update no show status");
      return;
    }
    this.restful.updateNoShowStudentAttendance(this.trainingData.uuid, this.noShowStudentIdList, this.showUpStudentIdList).subscribe({
      complete: () => this.initTrainingDetail()
    })
  }

  removeTrainingFromDB(training: ITraining) {
    if (confirm("Are you sure to delete this training")) {
      console.log(`remove uuid: `, training.uuid);
      this.restful.removeTraining(training.uuid).subscribe({
        next: result => {
          console.log(`removeTrainingFromDB result: `, result)
        }
      });
      this.dialogRef.close();
    }
  }
}
