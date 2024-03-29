import { Component, Input, OnInit } from '@angular/core';
import { ITraining } from '../../../../../model/forum/ITraining';
import { ForumBackendMainpageService } from '../../../../../services/aws-lambda/forum-backend-mainpage.service';
import { DateUtil } from '../../../../../services/date-util.service';
import { IAttendance } from '../../../../../model/forum/IAttendance';
import { MatDialog } from '@angular/material/dialog';
import { TrainingFormDialogComponent } from '../form-dialog/training-form-dialog.component';
import { combineLatest } from 'rxjs';
import { select, Store } from '@ngrx/store';
import {
  selectCurrentUserItsc,
  selectCurrentUserRole,
} from '../../../../../ngrx/auth0/auth0.selectors';
import {
  selectIsLoaded,
  selectTrainingDataList,
} from '../../../../../ngrx/training-data/training-data.selector';
import { updateTrainingDataList } from '../../../../../ngrx/training-data/training-data.action';

@Component({
  selector: 'app-training-content',
  templateUrl: './training-content.component.html',
  styleUrls: ['./training-content.component.scss'],
})
export class TrainingContentComponent implements OnInit {
  @Input() isEditAble: boolean;
  @Input() parentComponent: any;
  @Input() needUpdateUi: boolean;
  @Input() editTrainingContent: any;
  @Input() isInputFromTrainingDetail: boolean;
  @Input() isRefreshing: any;

  isAdmin: boolean;
  itsc: string;
  isLoading: boolean;

  trainingList: Array<ITraining>;

  constructor(
    private restful: ForumBackendMainpageService,
    public dateUtil: DateUtil,
    private trainingFormDialog: MatDialog,
    private store: Store<any>
  ) {
    console.log(`[${this.constructor.name}] constructor`);
    this.trainingList = new Array<ITraining>();
    this.isEditAble = false;
    this.isAdmin = false;
    this.itsc = '';
    this.needUpdateUi = true;
    this.isInputFromTrainingDetail = false;
    this.isLoading = true;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.initData();
  }

  initData() {
    combineLatest([
      this.store.pipe(select(selectCurrentUserRole)),
      this.store.pipe(select(selectCurrentUserItsc)),
      this.store.pipe(select(selectTrainingDataList)),
      this.store.pipe(select(selectIsLoaded)),
    ]).subscribe({
      next: ([userLoginRole, userItsc, trainingDataList, isLoaded]) => {
        console.log(`trainingDataList: `, trainingDataList);
        this.isAdmin = userLoginRole?.includes('Admin');
        this.itsc = userItsc;
        this.trainingList = this.editTrainingContent
          ? [this.editTrainingContent]
          : trainingDataList;
        this.isLoading = !isLoaded;
      },
    });
  }

  removeTrainingFromDB(training: ITraining) {
    console.log(`remove _id: `, training._id);
    this.restful.removeTraining(training._id).subscribe({
      next: (result) => {
        console.log(`removeTrainingFromDB result: `, result);
        this.removeWebViewTraining(training._id);
      },
    });
  }

  replyBtnOnclick(status: string, training: ITraining, absentReason: any) {
    console.log(`isEditable: `, this.isEditAble);
    console.log(`isAdmin: `, this.isAdmin);
    console.log(`event: `, status);
    console.log(`training: `, training);
    console.log(`absentReason: `, absentReason);
    console.log(`itsc: `, this.itsc);
    console.log(`isInputFromTrainingDetail: `, this.isInputFromTrainingDetail);
    //check absent reason is null or not
    if (status === 'absent' && !absentReason) {
      alert('You must fill in Absent reason!');
      return;
    }

    // check student response time with training time:
    //    create new Attendance:
    //    set Attendance:
    //      status:
    //        if(student response time > (training time deadline)) --> (DB)status: late reply
    //        else (DB)status -> (input)status
    //      reason: absentReason
    //      student_id: fetch from db in backend
    //      training_id: training._id
    //      created_at: new Date()
    //      updated_at: (isEditAble)? new Date(): null
    //      username: login info

    //check late or not
    let currentDateTime: any = this.dateUtil.formatToHKTimeWithHour(new Date());

    //check update time is due or not -> move to backend to prevent user change mobile time

    let attendance: IAttendance = {
      uuid: '',
      student_id: '',
      training_id: training._id,
      status: status,
      reason: absentReason,
      itsc: this.itsc,
      //format two date into same hkt format then compare
      is_late_reply: null,
      updated_at: currentDateTime,
    };
    console.log(`attendance to db: `, attendance);
    //    update Attendance table
    this.restful.createAttendance(attendance).subscribe({
      next: (result) => {
        console.log(`createAttendance with result: `, result);
      },
      complete: () => {
        //    refresh UI
        if (this.needUpdateUi) {
          this.removeWebViewTraining(training._id);
        }
        alert(`Attendance replied`);
      },
    });
  }

  removeWebViewTraining(trainingId: string) {
    this.trainingList = this.trainingList.filter(function (obj) {
      return obj._id !== trainingId;
    });
    this.store.dispatch(
      updateTrainingDataList({ trainingList: this.trainingList })
    );
  }

  editTraining(training: ITraining) {
    console.log(`editTraining: `, training);
    let dialogRef = this.trainingFormDialog.open(TrainingFormDialogComponent, {
      data: {
        training: training,
        isEditTraining: true,
        isInputFromTrainingDetail: this.isInputFromTrainingDetail,
      },
    });

    dialogRef.afterClosed().subscribe((updatedTraining) => {
      if (updatedTraining) {
        console.log(`updatedTraining: `, updatedTraining);
        this.trainingList = [updatedTraining.data];
      }
    });
  }
}
