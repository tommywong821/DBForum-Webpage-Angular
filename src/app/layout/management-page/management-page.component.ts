import {Component, OnInit} from '@angular/core';
import {ManagementDataService} from "../../services/data-services/management-data.service";
import {Auth0ManagementService} from "../../services/aws-lambda/auth0-management.service";
import {saveAs} from "file-saver";
import {forkJoin, Observable} from "rxjs";
import {IStudentAccount} from "../../model/auth0-management/IStudentAccount";
import {IUserRole} from "../../model/auth0-management/IUserRole";
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {FormBuilder, FormGroup} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {selectCurrentUserRole} from "../../ngrx/auth0/auth0.selectors";

@Component({
  selector: 'app-management-page',
  templateUrl: './management-page.component.html',
  styleUrls: ['./management-page.component.scss']
})
export class ManagementPageComponent implements OnInit {

  isAdmin: boolean;

  sampleCsv = [{
    "email": 'abcdefg@connect.ust.hk',
    "itsc": "abcdefg",
    "sid": "123456"
  }, {"email": "hijkl@connect.ust.hk", "itsc": "hijkl", "sid": "654321"}];

  inputFilePlaceholder = '';

  isCreatingAccount: boolean;
  isAssignFormLoading: boolean;
  isRemoveFormLoading: boolean;
  managementData$: Array<Observable<any>>;

  //delete student account part
  deleteStudentForm: FormGroup;
  isDeleteFormLoading: boolean;

  //assign role to student account part
  assignStudentAccountList: Array<IStudentAccount>;
  userRoleList: Array<IUserRole>;
  studentACDropDownSetting: IDropdownSettings;
  assignRoleDropDownSetting: IDropdownSettings;
  assignRoleForm: FormGroup;

  //remove role from student account part
  removeRoleDropDownSetting: IDropdownSettings;
  removeStudentAccountList: Array<IStudentAccount>;
  removeRoleForm: FormGroup;

  constructor(private managementData: ManagementDataService,
              private auth0Restful: Auth0ManagementService,
              private formBuilder: FormBuilder,
              private store: Store<any>) {
    console.log(`[${this.constructor.name}] constructor`);
    this.managementData$ = [this.auth0Restful.getStudentAccountList(), this.auth0Restful.getUserRolesList()];

    //delete student account
    this.deleteStudentForm = formBuilder.group({
      users: ''
    });
    this.isDeleteFormLoading = true;

    //assign role to student
    this.assignStudentAccountList = new Array<IStudentAccount>();
    this.userRoleList = new Array<IUserRole>();
    this.studentACDropDownSetting = {
      singleSelection: false,
      idField: 'user_id',
      textField: 'username',
      allowSearchFilter: true,
      enableCheckAll: true
    };
    this.assignRoleDropDownSetting = {
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
    this.isAssignFormLoading = true;

    //remove role from student
    this.removeRoleDropDownSetting = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true,
      enableCheckAll: false
    };
    this.removeStudentAccountList = new Array<IStudentAccount>();
    this.removeRoleForm = formBuilder.group({
      role: '',
      users: ''
    });
    this.isRemoveFormLoading = true;
    this.isCreatingAccount = false;
    this.inputFilePlaceholder = "Choose Student Account CSV";
    this.isAdmin = false;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.store.pipe(select(selectCurrentUserRole)).subscribe({
      next: (userLoginRole) => {
        if (userLoginRole) {
          this.isAdmin = userLoginRole.includes('Admin');
          this.fetchDataFromAuth0();
        }
      },
    });
  }

  fetchDataFromAuth0(){
    this.isAssignFormLoading = true;
    this.isRemoveFormLoading = true;
    this.isDeleteFormLoading = true;
    forkJoin(this.managementData$).subscribe({
      next: (result) => {
        this.managementData.studentAccountList = result[0];
        this.managementData.userRoleList = result[1];
      },
      complete: () => {
        this.assignStudentAccountList = this.managementData.studentAccountList;
        this.userRoleList = this.managementData.userRoleList;
        this.isAssignFormLoading = false;
        this.isRemoveFormLoading = false;
        this.isDeleteFormLoading = false;
      }
    });
  }

  uploadStudentCsv(event: any) {
    console.log(`event: `, event);
    let csv: FileList = event.target.files
    if (csv && csv.length > 0 && csv.item(0)) {
      let file: File | any = csv.item(0);
      console.log(`file: `, file);
      this.inputFilePlaceholder = file.name;
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
    this.isCreatingAccount = true;
    if (this.managementData.studentAccountCsv === "") {
      alert('Empty CSV is uploaded. Please try again');
    } else {
      //call auth0 management api
      this.auth0Restful.createLoginUser(this.managementData.studentAccountCsv).subscribe({
        complete: () => {
          alert('Student Account is created!');
          this.reset();
          this.fetchDataFromAuth0();
        }
      });
    }
  }

  reset() {
    this.isCreatingAccount = false;
    this.managementData.studentAccountCsv = "";
    this.inputFilePlaceholder = "Choose Student Account CSV";
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
    this.isAssignFormLoading = true;
    console.log(`assign role form: ${JSON.stringify(this.assignRoleForm.value)}`);
    if (!this.assignRoleForm.value.role[0] || !this.assignRoleForm.value.users) {
      alert('Please choose role and student(s) to assign');
      return;
    }
    const roleId = this.assignRoleForm.value.role[0].id;
    console.log(`roleId: `, roleId);
    const userIdList = this.assignRoleForm.value.users.map((user: IStudentAccount) => user.user_id);
    console.log(`userList: `, userIdList);
    this.auth0Restful.assignRoleToUsers(roleId, userIdList).subscribe({
      complete: () => {
        this.assignRoleForm.reset();
        alert('Role is assigned to user(s)');
        this.fetchDataFromAuth0();
      }
    });
  }

  clearStudent() {
    this.removeStudentAccountList = [];
  }

  getStudentInRole(event: any) {
    console.log(`event: `, event);
    this.isRemoveFormLoading = true;
    this.auth0Restful.getUserInRole(event.id).subscribe({
      next: (result) => {
        this.removeStudentAccountList = result
      },
      complete: () => {
        this.isRemoveFormLoading = false;
      }
    });
  }

  onSubmitRemoveRoleForm() {
    console.log(`remove role form: ${JSON.stringify(this.removeRoleForm.value)}`);
    this.isRemoveFormLoading = true;
    if (!this.removeRoleForm.value.role[0] || !this.removeRoleForm.value.users) {
      alert('Please choose role and student(s) to remove');
      return;
    }
    const roleId = this.removeRoleForm.value.role[0].id;
    const userIdList = this.removeRoleForm.value.users.map((user: IStudentAccount) => user.user_id);
    this.auth0Restful.removeRoleFromUser(roleId, userIdList).subscribe({
      complete: () => {
        this.removeRoleForm.reset();
        alert('Role is remove from user(s)');
        this.fetchDataFromAuth0();
      }
    });
  }

  onSubmitDeleteStudentForm() {
    console.log(`delete student form: ${JSON.stringify(this.deleteStudentForm.value)}`);
    this.isDeleteFormLoading = true;
    if (!this.deleteStudentForm.value) {
      alert('Please choose student(s) account to delete');
      return;
    }
    const studentAccountId = this.deleteStudentForm.value.users.map((student: any) => {
      return student.user_id;
    });
    this.auth0Restful.deleteUserAccount(studentAccountId).subscribe({
      complete: () => {
        this.deleteStudentForm.reset();
        alert('Student(s) is remove from forum');
        this.fetchDataFromAuth0();
      }
    })
  }
}
