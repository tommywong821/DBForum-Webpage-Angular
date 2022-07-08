import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ForumBackendMainpageService} from "../../../../services/aws-lambda/forum-backend-mainpage.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {IStudent} from "../../../../model/forum/IStudent";
import {DateUtil} from "../../../../services/date-util.service";
import {environment} from "../../../../../environments/environment";
import {ForumBackendDashboardService} from "../../../../services/aws-lambda/forum-backend-dashboard.service";

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
  profileForm: FormGroup;
  isLoading: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public inputDialogData: any,
              private mainpageRestful: ForumBackendMainpageService,
              private dashboardRestful: ForumBackendDashboardService,
              private formBuilder: FormBuilder,
              private dateUtil: DateUtil,
              private dialogRef: MatDialogRef<ProfileDialogComponent>) {
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
    if(this.inputDialogData.studentDetail){
      this.initProfileFormFromInputData(this.inputDialogData.studentDetail)
    }else{
      this.initProfileFormFromNull();
    }
    this.isLoading = false;
  }

  initProfileFormFromInputData(studentInfo: IStudent) {
    console.log(`initProfileFormFromInputData`)
    this.profileForm = this.formBuilder.group({
      itsc: studentInfo.itsc,
      nickname: new FormControl(studentInfo.nickname, Validators.required),
      date_of_birth: new FormControl(studentInfo.date_of_birth, Validators.required),
      gender: new FormControl(studentInfo.gender, Validators.required),
      weight: new FormControl(studentInfo.weight, Validators.required),
      updated_at: studentInfo.updated_at,
      paddle_side: new FormControl(studentInfo.paddle_side, Validators.required),
    })
  }

  initProfileFormFromNull() {
    console.log(`initProfileFormFromNull`)
    this.profileForm.setValue({
      itsc: (this.inputDialogData.itsc) ? this.inputDialogData.itsc : '',
      nickname: new FormControl('', Validators.required),
      date_of_birth: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      updated_at: new FormControl('', Validators.required),
      paddle_side: new FormControl('', Validators.required),
    });
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      alert("You must fill in all information")
      return
    }
    this.isLoading = true;
    this.profileForm.value.updated_at = this.dateUtil.formatToHKTime(new Date());
    console.log(`after: `, this.profileForm.value);
    if (this.inputDialogData.isUpdateCoach) {
      console.log(`isUpdateCoach`);
      const uuid = (this.inputDialogData.studentDetail?.uuid) ? this.inputDialogData.studentDetail.uuid : '-1'
      this.dashboardRestful.updateCoach(this.profileForm.value, uuid).subscribe({
        next: response => {
          if (response) {
            this.isLoading = false;
            this.profileForm.value.uuid = response;
            this.dialogRef.close({data: this.profileForm.value});
          } else {
            alert('updateCoach fail');
          }
        }
      })
    } else {
      this.mainpageRestful.updateStudentProfile(this.profileForm.value.itsc, this.profileForm.value).subscribe({
        next: response => {
          if (response) {
            sessionStorage.setItem(environment.studentProfileKey, JSON.stringify(this.profileForm.value));
            this.isLoading = false;
            this.dialogRef.close();
          } else {
            alert(`updateStudentProfile fail`);
          }
        }
      });
    }
  }
}
