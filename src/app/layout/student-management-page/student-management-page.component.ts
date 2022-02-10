import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ManagementDataService} from "../../services/management-data.service";
import {Auth0ManagementService} from "../../services/aws-lambda/auth0-management.service";
import {saveAs} from "file-saver";
import {forkJoin, Observable} from "rxjs";
import {IStudentAccount} from "../../model/auth0-management/IStudentAccount";
import {IUserRole} from "../../model/auth0-management/IUserRole";
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-student-management-page',
  templateUrl: './student-management-page.component.html',
  styleUrls: ['./student-management-page.component.scss']
})
export class StudentManagementPageComponent implements OnInit {

  sampleCsv = [{
    "email": 'abcdefg@connect.ust.hk',
    "itsc": "abcdefg",
    "sid": "123456"
  }, {"email": "hijkl@connect.ust.hk", "itsc": "hijkl", "sid": "654321"}];

  @ViewChild('uploadCsvInput') uploadCsvVariable!: ElementRef;

  managementData$: Array<Observable<any>>;

  studentAccountList: Array<IStudentAccount>;
  userRoleList: Array<IUserRole>;

  studentACDropDownSetting: IDropdownSettings;
  roleDropDownSetting: IDropdownSettings;
  assignRoleForm: FormGroup;
  isLoading: boolean;

  constructor(private managementData: ManagementDataService,
              private auth0Restful: Auth0ManagementService,
              private formBuilder: FormBuilder) {
    console.log(`[${this.constructor.name}] constructor`);
    this.managementData$ = [this.auth0Restful.getStudentAccountList(), this.auth0Restful.getUserRolesList()]
    this.studentAccountList = new Array<IStudentAccount>();
    this.userRoleList = new Array<IUserRole>();
    this.studentACDropDownSetting = {
      singleSelection: false,
      idField: 'user_id',
      textField: 'username',
      allowSearchFilter: true,
      enableCheckAll: false
    };
    this.roleDropDownSetting = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true,
      enableCheckAll: false
    };
    this.assignRoleForm = formBuilder.group({
      role: '',
      users: ''
    });
    this.isLoading = true;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    forkJoin(this.managementData$).subscribe({
      next: (result) => {
        console.log(`result: ${JSON.stringify(result)}`);
        this.managementData.studentAccountList = result[0];
        this.managementData.userRoleList = result[1];
      },
      complete: () => {
        this.studentAccountList = this.managementData.studentAccountList;
        this.userRoleList = this.managementData.userRoleList;
        this.isLoading = false;
      }
    })
  }

  uploadStudentCsv(event: any) {
    let csv: FileList = event.target.files
    if (csv && csv.length > 0 && csv.item(0)) {
      let file: File | any = csv.item(0);
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: string = reader.result as string;
        console.log(`uploaded csv: ${csv}`);
        this.managementData.studentAccountCsv = csv;
      }
    }
  }

  createUser() {
    console.log(`management data service: ${this.managementData.studentAccountCsv}`);
    if (this.managementData.studentAccountCsv === "") {
      alert('Empty CSV is uploaded. Please try again');
    } else {
      //call auth0 management api
      this.auth0Restful.createLoginUser(this.managementData.studentAccountCsv).subscribe({
        complete: () => {
          alert('Student Account is created!');
          this.reset();
        }
      })
    }
  }

  reset() {
    this.uploadCsvVariable.nativeElement.value = "";
    this.managementData.studentAccountCsv = "";
  }

  downloadSampleFile() {
    const replacer = (key: string, value: string) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys((this.sampleCsv)[0]);

    const csv = [
      header.join(','), // header row first
      // @ts-ignore
      ...this.sampleCsv.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');

    const blob = new Blob([csv], {type: 'text/csv'});
    saveAs(blob, "SampleLoginInfo.csv");
  }

  onSubmitAssignRoleForm() {
    console.log(`selected form: ${JSON.stringify(this.assignRoleForm.value)}`);
    if (!this.assignRoleForm.value.role[0] || !this.assignRoleForm.value.users) {
      alert('Please choose role and student(s) to assign');
      return;
    }
    const roleId = this.assignRoleForm.value.role[0].id;
    console.log(`roleId: `, roleId);
    const userList = this.assignRoleForm.value.users.map((user: IStudentAccount) => user.user_id);
    console.log(`userList: `, userList);
    this.auth0Restful.assignRoleToUsers(roleId, userList).subscribe({
      complete: () => {
        this.clearAssignRoleForm();
        alert('Role is assigned to users');
      }
    });
  }

  clearAssignRoleForm() {
    this.assignRoleForm.setValue({
      role: '',
      users: ''
    })
  }
}
