import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ForumBackendMainpageService } from '../../../../services/aws-lambda/forum-backend-mainpage.service';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { IStudent } from '../../../../model/forum/IStudent';
import { DateUtil } from '../../../../services/date-util.service';
import { environment } from '../../../../../environments/environment';
import { ForumBackendDashboardService } from '../../../../services/aws-lambda/forum-backend-dashboard.service';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
})
export class ProfileDialogComponent implements OnInit {
  profileForm: UntypedFormGroup;
  isLoading: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputDialogData: any,
    private mainpageRestful: ForumBackendMainpageService,
    private dashboardRestful: ForumBackendDashboardService,
    private formBuilder: UntypedFormBuilder,
    private dateUtil: DateUtil,
    private dialogRef: MatDialogRef<ProfileDialogComponent>
  ) {
    console.log(`[${this.constructor.name}] constructor`);
    this.profileForm = this.formBuilder.group({
      itsc: '',
      nickname: '',
      date_of_birth: '',
      gender: '',
      weight: '',
      updated_at: '',
      paddle_side: '',
    });
    this.isLoading = true;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    console.log(`inputDialogData: `, this.inputDialogData);
    if (this.inputDialogData.studentDetail) {
      this.initProfileFormFromInputData(this.inputDialogData.studentDetail);
    } else {
      this.initProfileFormFromNull();
    }
    this.isLoading = false;
  }

  initProfileFormFromInputData(studentInfo: IStudent) {
    console.log(`initProfileFormFromInputData`);
    this.profileForm = this.formBuilder.group({
      itsc: studentInfo.itsc,
      nickname: new UntypedFormControl(
        studentInfo.nickname,
        Validators.required
      ),
      date_of_birth: new UntypedFormControl(
        studentInfo.date_of_birth,
        Validators.required
      ),
      gender: new UntypedFormControl(studentInfo.gender, Validators.required),
      weight: new UntypedFormControl(studentInfo.weight, Validators.required),
      updated_at: studentInfo.updated_at,
      paddle_side: new UntypedFormControl(
        studentInfo.paddle_side,
        Validators.required
      ),
    });
  }

  initProfileFormFromNull() {
    console.log(`initProfileFormFromNull`);
    this.profileForm.setValue({
      itsc: this.inputDialogData.itsc ? this.inputDialogData.itsc : '',
      nickname: new UntypedFormControl('', Validators.required),
      date_of_birth: new UntypedFormControl('', Validators.required),
      gender: new UntypedFormControl('', Validators.required),
      weight: new UntypedFormControl('', Validators.required),
      updated_at: new UntypedFormControl('', Validators.required),
      paddle_side: new UntypedFormControl('', Validators.required),
    });
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      alert('You must fill in all information');
      return;
    }
    this.isLoading = true;
    this.profileForm.value.updated_at = this.dateUtil.formatToHKTimeWithHour(
      new Date()
    );
    console.log(`after: `, this.profileForm.value);
    if (this.inputDialogData.isUpdateCoach) {
      console.log(`isUpdateCoach`);
      const uuid = this.inputDialogData.studentDetail?.uuid
        ? this.inputDialogData.studentDetail.uuid
        : '-1';
      this.dashboardRestful
        .updateCoach(this.profileForm.value, uuid)
        .subscribe({
          next: (response) => {
            if (response) {
              this.isLoading = false;
              this.profileForm.value.uuid = response;
              this.dialogRef.close({ data: this.profileForm.value });
            } else {
              alert('updateCoach fail');
            }
          },
        });
    } else {
      this.mainpageRestful
        .updateStudentProfile(
          this.profileForm.value.itsc,
          this.profileForm.value
        )
        .subscribe({
          next: (response) => {
            if (response) {
              sessionStorage.setItem(
                environment.studentProfileKey,
                JSON.stringify(this.profileForm.value)
              );
              this.isLoading = false;
              this.dialogRef.close();
            } else {
              alert(`updateStudentProfile fail`);
            }
          },
        });
    }
  }
}
