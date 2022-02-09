import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ForumBackendService} from "../../../services/aws-lambda/forum-backend.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {IStudent} from "../../../model/interface/IStudent";
import {DateUtil} from "../../../services/date-util.service";

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
  profileForm: FormGroup;
  isLoading: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public inputDialogData: any,
              private restful: ForumBackendService,
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
    this.restful.getStudentDetail(this.inputDialogData.itsc).subscribe({
      next: (result) => {
        console.log(`getStudentDetail: `, result);
        if (result) {
          this.initProfileFormFromApi(result);
        } else {
          this.initProfileFormFromNull();
        }
      },
      complete: () => {
        console.log('getStudentDetail complete');
        this.isLoading = false;
      }
    })
  }

  initProfileFormFromApi(studentInfo: IStudent) {
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
    this.profileForm.setValue({
      itsc: this.inputDialogData.itsc,
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
    this.restful.updateStudentProfile(this.inputDialogData.itsc, this.profileForm.value).subscribe({
      next: (result) => {
      },
      complete: () => {
        this.isLoading = false;
        this.dialogRef.close();
      }
    });
  }
}
