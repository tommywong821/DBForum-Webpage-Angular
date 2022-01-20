import {Component, Input, OnInit} from '@angular/core';
import {ITraining} from "../../../model/interface/ITraining";
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {AuthService} from "@auth0/auth0-angular";

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

  constructor(private restful: AwsLambdaBackendService,
              public auth: AuthService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.trainingList = [];
    this.isEditAble = false;
    this.isAdmin = false;
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
    console.log(`parentComponent: `, this.parentComponent);
    /*check student response time with training time:
    *   create new Attendance:
    *   set Attendance:
    *     status:
    *       if(student response time > (training time 前一日17:00)) --> (DB)status: late reply
    *       else (DB)status -> (input)status
    *     reason: absentReason
    *     student_id: login info
    *     training_id: training._id
    *     created_at: new Date()
    *     updated_at: (isEditAble)? new Date(): null
    *
    *   update Attendance table
    *   refresh UI
    * */
    // this.removeWebViewTraining(training._id);
  }

  removeWebViewTraining(trainingId: string) {
    this.trainingList = this.trainingList.filter(function (obj) {
      return obj._id !== trainingId;
    })
  }
}
