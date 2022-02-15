import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ForumBackendService} from "../../../services/aws-lambda/forum-backend.service";
import {IReminder} from "../../../model/forum/IReminder";
import {DateUtil} from "../../../services/date-util.service";
import ObjectID from "bson-objectid";
import {Auth0DataService} from "../../../services/auth0-data.service";
import {v4 as uuidV4} from 'uuid';

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
              private restful: ForumBackendService,
              private dateUtil: DateUtil,
              private auth0DataService: Auth0DataService) {
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
    this.isAdmin = this.auth0DataService.loginRole.includes('Admin');
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
        this.reminderId = result.uuid;
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
      uuid: (this.reminderId) ? this.reminderId : uuidV4(),
      message: this.reminderForm.value.reminder,
      updated_at: this.dateUtil.formatToHKTime(new Date()),
      last_edit_user: this.auth0DataService.loginUserItsc
    }
    console.log(`newReminder: `, newReminder);
    this.restful.updateReminderMessage(newReminder.uuid, newReminder).subscribe({
      complete: () => {
        this.isLoading = false;
        this.isReadOnly = true;
      }
    });
  }
}
