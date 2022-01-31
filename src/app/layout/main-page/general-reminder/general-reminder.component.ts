import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {IReminder} from "../../../model/interface/IReminder";
import {DateUtil} from "../../../services/date-util.service";
import ObjectID from "bson-objectid";
import {Auth0Service} from "../../../services/auth0.service";

@Component({
  selector: 'app-general-reminder',
  templateUrl: './general-reminder.component.html',
  styleUrls: ['./general-reminder.component.scss']
})
export class GeneralReminderComponent implements OnInit {

  isReadOnly: boolean;
  reminderForm: FormGroup;
  isLoading: boolean;
  reminderId: string;
  isAdmin: boolean;

  constructor(private formBuilder: FormBuilder,
              private restful: AwsLambdaBackendService,
              private dateUtil: DateUtil,
              private auth0: Auth0Service) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isReadOnly = true;
    this.reminderForm = this.formBuilder.group({
      reminder: ''
    });
    this.isLoading = true;
    this.reminderId = '';
    this.isAdmin = false;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.initReminderMessage();
    this.isAdmin = this.auth0.loginRole.includes('Admin');
  }

  enableEdit() {
    this.isReadOnly = !this.isReadOnly;
  }

  initReminderMessage() {
    this.restful.getReminderMessage().subscribe({
      next: (result: IReminder) => {
        this.reminderForm.setValue({
          reminder: result.message
        });
        this.reminderId = result._id;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  submitReminder() {
    this.isLoading = true;
    console.log(`reminder: `, this.reminderForm.value.reminder);
    console.log(`this.reminderId: `, this.reminderId);
    let newReminder: IReminder = {
      _id: (this.reminderId) ? this.reminderId : ObjectID().toHexString(),
      message: this.reminderForm.value.reminder,
      updated_at: this.dateUtil.formatToHKTime(new Date()),
      last_edit_user: ''
    }
    console.log(`newReminder: `, newReminder);
    this.restful.updateReminderMessage(newReminder._id, newReminder).subscribe({
      complete: () => {
        this.isLoading = false;
        this.isReadOnly = true;
      }
    });
  }
}
