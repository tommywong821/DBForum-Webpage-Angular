import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ForumBackendService} from "../../../services/aws-lambda/forum-backend.service";
import {IReminder} from "../../../model/forum/IReminder";
import {DateUtil} from "../../../services/date-util.service";
import {v4 as uuidV4} from 'uuid';
import {select, Store} from "@ngrx/store";
import {selectCurrentUserItsc, selectCurrentUserRole} from "../../../ngrx/auth0/auth0.selectors";
import {combineLatest} from "rxjs";

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
  userItsc: any;

  constructor(private formBuilder: FormBuilder,
              private restful: ForumBackendService,
              private dateUtil: DateUtil,
              private store: Store<any>) {
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
    combineLatest([
      this.store.pipe(select(selectCurrentUserRole)),
      this.store.pipe(select(selectCurrentUserItsc))
    ]).subscribe({
      next: ([userLoginRole, userItsc]) => {
        this.isAdmin = userLoginRole?.includes('Admin');
        this.userItsc = userItsc;
      }
    })
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
      last_edit_user: this.userItsc,
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
