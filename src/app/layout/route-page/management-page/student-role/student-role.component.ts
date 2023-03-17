import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { IStudentAccount } from '../../../../model/auth0-management/IStudentAccount';
import { forkJoin, Observable } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IUserRole } from '../../../../model/auth0-management/IUserRole';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ForumBackendManagementService } from '../../../../services/aws-lambda/forum-backend-management.service';
import { ManagementDataService } from '../../../../services/data-services/management-data.service';

@Component({
  selector: 'app-student-role',
  templateUrl: './student-role.component.html',
  styleUrls: ['./student-role.component.scss'],
})
export class StudentRoleComponent implements OnInit {
  sampleCsv = [
    {
      email: 'abcdefg@connect.ust.hk',
      itsc: 'abcdefg',
      sid: '123456',
      'grad year': '2022',
    },
    {
      email: 'hijkl@connect.ust.hk',
      itsc: 'hijkl',
      sid: '654321',
      'grad year': '2024',
    },
  ];

  inputFilePlaceholder = '';

  isCreatingAccount: boolean;
  isAssignFormLoading: boolean;
  isRemoveFormLoading: boolean;
  managementData$: Array<Observable<any>>;

  //delete student account part
  deleteStudentForm: UntypedFormGroup;
  isDeleteFormLoading: boolean;

  //assign role to student account part
  assignStudentAccountList: Array<IStudentAccount>;
  userRoleList: Array<IUserRole>;
  studentACDropDownSetting: IDropdownSettings;
  assignRoleDropDownSetting: IDropdownSettings;
  assignRoleForm: UntypedFormGroup;

  //remove role from student account part
  removeRoleDropDownSetting: IDropdownSettings;
  removeStudentAccountList: Array<IStudentAccount>;
  removeRoleForm: UntypedFormGroup;

  constructor(
    private managementRestful: ForumBackendManagementService,
    private formBuilder: UntypedFormBuilder,
    private managementData: ManagementDataService
  ) {
    this.managementData$ = [
      this.managementRestful.getStudentAccountList(),
      this.managementRestful.getUserRolesList(),
    ];

    //delete student account
    this.deleteStudentForm = formBuilder.group({
      users: '',
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
      enableCheckAll: true,
    };
    this.assignRoleDropDownSetting = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true,
      enableCheckAll: false,
    };
    this.assignRoleForm = formBuilder.group({
      role: '',
      users: '',
    });
    this.isAssignFormLoading = true;

    //remove role from student
    this.removeRoleDropDownSetting = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true,
      enableCheckAll: false,
    };
    this.removeStudentAccountList = new Array<IStudentAccount>();
    this.removeRoleForm = formBuilder.group({
      role: '',
      users: '',
    });
    this.isRemoveFormLoading = true;
    this.isCreatingAccount = false;
    this.inputFilePlaceholder = 'Choose Student Account CSV';
  }

  ngOnInit(): void {
    this.fetchDataFromAuth0();
  }

  downloadSampleFile() {
    const replacer = (key: string, value: string) =>
      value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(this.sampleCsv[0]);

    const csv = [
      header.join(','), // header row first
      ...this.sampleCsv.map((row) =>
        header
          // @ts-ignore
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'SampleLoginInfo.csv');
  }

  uploadStudentCsv(event: any) {
    console.log(`event: `, event);
    let csv: FileList = event.target.files;
    if (csv && csv.length > 0 && csv.item(0)) {
      let file: File | any = csv.item(0);
      console.log(`file: `, file);
      this.inputFilePlaceholder = file.name;
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: string = reader.result as string;
        csv = csv.replace(/ /g, '');
        console.log(`uploaded csv: ${csv}`);
        this.managementData.studentAccountCsv = csv;
      };
    }
  }

  createUser() {
    console.log(
      `management data service: ${this.managementData.studentAccountCsv}`
    );
    this.isCreatingAccount = true;
    if (this.managementData.studentAccountCsv === '') {
      alert('Empty CSV is uploaded. Please try again');
      this.reset();
    } else {
      //call auth0 management api
      this.managementRestful
        .createLoginUser({ student: this.managementData.studentAccountCsv })
        .subscribe({
          complete: () => {
            alert('Student Account is created!');
            this.reset();
            this.fetchDataFromAuth0();
          },
        });
    }
  }

  getStudentInRole(event: any) {
    console.log(`event: `, event);
    this.isRemoveFormLoading = true;
    this.managementRestful.getUserInRole(event.id).subscribe({
      next: (result) => {
        this.removeStudentAccountList = result;
      },
      complete: () => {
        this.isRemoveFormLoading = false;
      },
    });
  }

  reset() {
    this.isCreatingAccount = false;
    this.managementData.studentAccountCsv = '';
    this.inputFilePlaceholder = 'Choose Student Account CSV';
  }

  onSubmitDeleteStudentForm() {
    console.log(
      `delete student form: ${JSON.stringify(this.deleteStudentForm.value)}`
    );
    this.isDeleteFormLoading = true;
    if (!this.deleteStudentForm.value) {
      alert('Please choose student(s) account to delete');
      return;
    }
    const studentAccountId = this.deleteStudentForm.value.users.map(
      (student: any) => {
        return {
          auth0_id: student.user_id,
          itsc: student.username,
        };
      }
    );
    console.log(`studentAccountId: `, studentAccountId);
    this.managementRestful.deleteUserAccount(studentAccountId).subscribe({
      complete: () => {
        this.deleteStudentForm.reset();
        alert('Student(s) is remove from forum');
        this.fetchDataFromAuth0();
      },
    });
  }

  onSubmitAssignRoleForm() {
    this.isAssignFormLoading = true;
    console.log(
      `assign role form: ${JSON.stringify(this.assignRoleForm.value)}`
    );
    if (
      !this.assignRoleForm.value.role[0] ||
      !this.assignRoleForm.value.users
    ) {
      alert('Please choose role and student(s) to assign');
      return;
    }
    const roleId = this.assignRoleForm.value.role[0].id;
    console.log(`roleId: `, roleId);
    const userIdList = this.assignRoleForm.value.users.map(
      (user: IStudentAccount) => user.user_id
    );
    console.log(`userList: `, userIdList);
    this.managementRestful.assignRoleToUsers(roleId, userIdList).subscribe({
      complete: () => {
        this.assignRoleForm.reset();
        alert('Role is assigned to user(s)');
        this.fetchDataFromAuth0();
      },
    });
  }

  onSubmitRemoveRoleForm() {
    console.log(
      `remove role form: ${JSON.stringify(this.removeRoleForm.value)}`
    );
    this.isRemoveFormLoading = true;
    if (
      !this.removeRoleForm.value.role[0] ||
      !this.removeRoleForm.value.users
    ) {
      alert('Please choose role and student(s) to remove');
      return;
    }
    const roleId = this.removeRoleForm.value.role[0].id;
    const userIdList = this.removeRoleForm.value.users.map(
      (user: IStudentAccount) => user.user_id
    );
    this.managementRestful.removeRoleFromUser(roleId, userIdList).subscribe({
      complete: () => {
        this.removeRoleForm.reset();
        alert('Role is remove from user(s)');
        this.fetchDataFromAuth0();
      },
    });
  }

  clearStudent() {
    this.removeStudentAccountList = [];
  }

  fetchDataFromAuth0() {
    this.isAssignFormLoading = true;
    this.isRemoveFormLoading = true;
    this.isDeleteFormLoading = true;

    forkJoin([...this.managementData$]).subscribe({
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
      },
    });
  }
}
