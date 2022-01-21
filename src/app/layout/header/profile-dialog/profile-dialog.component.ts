import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {IStudent} from "../../../model/interface/IStudent";

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
  profileForm: FormGroup;
  isLoading: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public inputDialogData: any,
              private restful: AwsLambdaBackendService,
              private formBuilder: FormBuilder) {
    console.log(`[${this.constructor.name}] constructor`);
    this.profileForm = this.formBuilder.group({
      username: '',
      dateOfBirth: '',
      gender: '',
      weight: '',
      lastUpdateTime: '',
      email: '',
      paddleSize: '',
    });
    this.isLoading = true;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    console.log(`inputDialogData: `, this.inputDialogData);
    this.restful.getStudentDetail(this.inputDialogData.username).subscribe({
      next: (result) => {
        console.log(`getStudentDetail: `, result);
        this.initProfileForm(result);
      },
      complete: () => {
        console.log('getStudentDetail complete');
        this.isLoading = false;
      }
    })
  }

  initProfileForm(studentInfo: IStudent) {
    this.profileForm.setValue({
      username: studentInfo.username,
      dateOfBirth: studentInfo.date_of_birth,
      gender: studentInfo.gender,
      weight: studentInfo.weight,
      lastUpdateTime: studentInfo.updated_at,
      email: studentInfo.email,
      paddleSize: studentInfo.paddle_side,
    });
  }
}
