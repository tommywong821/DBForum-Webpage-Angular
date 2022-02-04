import {Component, Input, OnInit} from '@angular/core';
import {ITraining} from "../../../model/interface/ITraining";
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {DateUtil} from "../../../services/date-util.service";
import {Auth0Service} from "../../../services/auth0.service";
import {IAttendance} from "../../../model/interface/IAttendance";
import {TrainingDataService} from "../../../services/training-data.service";
import {MatDialog} from "@angular/material/dialog";
import {TrainingFormDialogComponent} from "../training-form-dialog/training-form-dialog.component";

@Component({
  selector: 'app-training-content',
  templateUrl: './training-content.component.html',
  styleUrls: ['./training-content.component.scss']
})
export class TrainingContentComponent implements OnInit {

  @Input() trainingList: Array<ITraining>;
  @Input() isEditAble: boolean;
  @Input() parentComponent: any;
  @Input() needUpdateUi: boolean;

  isAdmin: boolean;
  itsc: string;

  constructor(private restful: AwsLambdaBackendService,
              private auth0: Auth0Service,
              private dateUtil: DateUtil,
              private trainingDataService: TrainingDataService,
              private trainingFormDialog: MatDialog) {
    console.log(`[${this.constructor.name}] constructor`);
    this.trainingList = [];
    this.isEditAble = false;
    this.isAdmin = false;
    this.itsc = '';
    this.needUpdateUi = true;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.itsc = this.auth0.loginUserItsc;
    this.isAdmin = this.auth0.loginRole.includes('Admin');
  }

  removeTrainingFromDB(training: ITraining) {
    this.restful.removeTraining(training._id).subscribe({
      next: result => {
        console.log(`removeTrainingFromDB result: `, result)
        this.removeWebViewTraining(training._id);
      }
    });
  }

  replyBtnOnclick(status: string, training: ITraining, absentReason: any) {
    console.log(`isEditable: `, this.isEditAble);
    console.log(`isAdmin: `, this.isAdmin);
    console.log(`event: `, status);
    console.log(`training: `, training);
    console.log(`absentReason: `, absentReason);
    console.log(`itsc: `, this.itsc);
    // check student response time with training time:
    //    create new Attendance:
    //    set Attendance:
    //      status:
    //        if(student response time > (training time 前一日17:00)) --> (DB)status: late reply
    //        else (DB)status -> (input)status
    //      reason: absentReason
    //      student_id: fetch from db in backend
    //      training_id: training._id
    //      created_at: new Date()
    //      updated_at: (isEditAble)? new Date(): null
    //      username: login info

    //check late or not
    if ('attend' === status.toLowerCase()) {
      var date: any = this.dateUtil.formatToHKTime(new Date());
      console.log(`date1: `, date);
      var date2: any = new Date(training.date);
      //get late reply time range
      date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate() - 1, 17, 0, 0);
      console.log(`date2: `, date2);
      console.log(`compare them: `, new Date(date) > new Date(date2));
      //late reply
      if (new Date(date) > new Date(date2)) {
        status = 'late reply';
      }
    }

    let attendance: IAttendance = {
      _id: '',
      student_id: '',
      training_id: training._id,
      status: status,
      reason: absentReason,
      itsc: this.itsc
    }
    delete attendance._id;
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
        this.trainingDataService.needRefresh();
      }
    });
  }

  removeWebViewTraining(trainingId: string) {
    this.trainingList = this.trainingList.filter(function (obj) {
      return obj._id !== trainingId;
    });
  }

  editTraining(training: ITraining) {
    console.log(`editTraining: `, training);
    const dialogRef = this.trainingFormDialog.open(TrainingFormDialogComponent, {
      data: {
        training: training,
        isEditTraining: true
      }
    });
  }
}
