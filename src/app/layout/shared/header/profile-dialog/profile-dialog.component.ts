import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ForumMainPageBackendService} from "../../../../services/aws-lambda/forum-main-page-backend.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {IStudent} from "../../../../model/forum/IStudent";
import {DateUtil} from "../../../../services/date-util.service";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
  profileForm: FormGroup;
  isLoading: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public inputDialogData: any,
              private restful: ForumMainPageBackendService,
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
    this.profileForm.setValue({
      itsc: studentInfo.itsc,
      nickname: studentInfo.nickname,
      date_of_birth: studentInfo.date_of_birth,
      gender: studentInfo.gender,
      weight: studentInfo.weight,
      updated_at: studentInfo.updated_at,
      paddle_side: studentInfo.paddle_side,
    });
  }

  initProfileFormFromNull() {
    console.log(`initProfileFormFromNull`)
    this.profileForm.setValue({
      itsc: (this.inputDialogData.itsc) ? this.inputDialogData.itsc : '',
      nickname: '',
      date_of_birth: '',
      gender: '',
      weight: '',
      updated_at: '',
      paddle_side: '',
    });
  }

  updateProfile() {
    this.isLoading = true;
    this.profileForm.value.updated_at = this.dateUtil.formatToHKTime(new Date());
    console.log(`after: `, this.profileForm.value);
    if (this.inputDialogData.isUpdateCoach) {
      console.log(`isUpdateCoach`);
      const uuid = (this.inputDialogData.studentDetail?.uuid) ? this.inputDialogData.studentDetail.uuid : '-1'
      this.restful.updateCoach(this.profileForm.value, uuid).subscribe({
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
      this.restful.updateStudentProfile(this.profileForm.value.itsc, this.profileForm.value).subscribe({
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
