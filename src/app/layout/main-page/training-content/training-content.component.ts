import {Component, Input, OnInit} from '@angular/core';
import {ITraining} from "../../../model/interface/ITraining";
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {AuthService} from "@auth0/auth0-angular";
import {DateUtil} from "../../../services/date-util.service";
import {Attendance} from "../../../model/Attendance";

@Component({
  selector: 'app-training-content',
  templateUrl: './training-content.component.html',
  styleUrls: ['./training-content.component.scss']
})
export class TrainingContentComponent implements OnInit {

  @Input() trainingList: Array<ITraining>;
  @Input() isEditAble: boolean;
  @Input() parentComponent: any;

  isAdmin: boolean;
  username: string;

  constructor(private restful: AwsLambdaBackendService,
              private auth: AuthService,
              public dateUtil: DateUtil) {
    console.log(`[${this.constructor.name}] constructor`);
    this.trainingList = [];
    this.isEditAble = false;
    this.isAdmin = false;
    this.username = '';
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.auth.user$.subscribe({
      next: (user) => {
        console.log(`login user: `, user);
        if (user) {
          if (user['http://demozero.net/roles'].includes('Admin')) {
            this.isAdmin = true;
          }
          this.username = user['http://demozero.net/username'];
        }
      }
    });
  }

  removeTrainingFromDB(training: ITraining) {
    this.restful.removeTraining(training._id).subscribe({
      next: result => {
        console.log(`removeTrainingFromDB result: `, result)
        this.removeWebViewTraining(training._id);
      }
    })
  }

  replyBtnOnclick(status: string, training: ITraining, absentReason: any) {
    console.log(`isEditable: `, this.isEditAble);
    console.log(`isAdmin: `, this.isAdmin);
    console.log(`event: `, status);
    console.log(`training: `, training);
    console.log(`absentReason: `, absentReason);
    console.log(`username: `, this.username);
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

    let attendance: Attendance = {
      _id: '',
      student_id: '',
      training_id: training._id,
      status: status,
      reason: absentReason,
      username: this.username
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
        this.removeWebViewTraining(training._id);
      }
    })
  }

  removeWebViewTraining(trainingId: string) {
    this.trainingList = this.trainingList.filter(function (obj) {
      return obj._id !== trainingId;
    })
  }
}
