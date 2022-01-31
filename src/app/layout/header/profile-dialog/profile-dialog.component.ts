import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
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
              private restful: AwsLambdaBackendService,
              private formBuilder: FormBuilder,
              private dateUtil: DateUtil,
              private dialogRef: MatDialogRef<ProfileDialogComponent>) {
    console.log(`[${this.constructor.name}] constructor`);
    this.profileForm = this.formBuilder.group({
      itsc: '',
      nickname: '',
      dateOfBirth: '',
      gender: '',
      weight: '',
      lastUpdateTime: '',
      paddleSize: '',
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
      dateOfBirth: studentInfo.date_of_birth,
      gender: studentInfo.gender,
      weight: studentInfo.weight,
      lastUpdateTime: studentInfo.updated_at,
      paddleSize: studentInfo.paddle_side,
    });
  }

  initProfileFormFromNull() {
    this.profileForm.setValue({
      itsc: this.inputDialogData.itsc,
      nickname: '',
      dateOfBirth: '',
      gender: '',
      weight: '',
      lastUpdateTime: '',
      paddleSize: '',
    });
  }

  updateProfile() {
    this.isLoading = true;
    this.profileForm.value.lastUpdateTime = this.dateUtil.formatToHKTime(new Date());
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
