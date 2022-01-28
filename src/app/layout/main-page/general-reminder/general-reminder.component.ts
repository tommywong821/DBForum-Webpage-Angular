import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {IReminder} from "../../../model/interface/IReminder";

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

  constructor(private formBuilder: FormBuilder,
              private restful: AwsLambdaBackendService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isReadOnly = true;
    this.reminderForm = this.formBuilder.group({
      reminder: ''
    });
    this.isLoading = true;
    this.reminderId = '';
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.initReminderMessage();
  }

  enableEdit() {
    this.isReadOnly = !this.isReadOnly;
  }

  initReminderMessage() {
    this.restful.getReminderMessage().subscribe({
      next: (result: IReminder) => {
        console.log(`getReminderMessage: `, result);
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
    console.log(`reminder: `, this.reminderForm.value.reminder);
  }
}
