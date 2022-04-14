import {Component, OnInit} from '@angular/core';
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {ForumBackendManagementService} from "../../../../services/aws-lambda/forum-backend-management.service";
import {IStudent} from "../../../../model/forum/IStudent";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-student-account-activation',
  templateUrl: './student-account-activation.component.html',
  styleUrls: ['./student-account-activation.component.scss']
})
export class StudentAccountActivationComponent implements OnInit {

  actionList = [
    {
      action_id: "active",
      action_text: "Active"
    },
    {
      action_id: "deactivate",
      action_text: "Deactivate"
    }
  ]
  actionDropDownSetting: IDropdownSettings;
  studentListDropDownSetting: IDropdownSettings;
  studentListByStatus: Array<IStudent>;

  isLoading: boolean;

  changeStudentStatusForm: FormGroup;
  updateStudentStatus: boolean;

  constructor(private managementRestful: ForumBackendManagementService,
              private formBuilder: FormBuilder) {
    this.actionDropDownSetting = {
      singleSelection: true,
      idField: 'action_id',
      textField: 'action_text'
    };
    this.studentListDropDownSetting = {
      singleSelection: false,
      idField: 'uuid',
      textField: 'itsc',
      allowSearchFilter: true
    }
    this.studentListByStatus = new Array<IStudent>();
    this.isLoading = false;
    this.changeStudentStatusForm = formBuilder.group({
      studentList: ''
    });
    this.updateStudentStatus = false;
  }

  ngOnInit(): void {
  }

  onActionSelect(event: any) {
    this.isLoading = true;
    console.log(`onActionSelect: `, event);
    this.updateStudentStatus = (event.action_id == "active");
    this.managementRestful.getStudent(!(event.action_id == "active")).subscribe({
      next: (studentList) => {
        this.studentListByStatus = studentList;
      },
      complete: () => {
        this.isLoading = false;
        this.changeStudentStatusForm.get("studentList")?.setValue([]);
      }
    })
  }

  onActionDeSelect() {
    this.studentListByStatus = [];
  }

  onSubmitChangeStudentStatusForm() {
    this.isLoading = true;
    console.log(`onSubmitChangeStudentStatusForm: ${JSON.stringify(this.changeStudentStatusForm.value)}`);
    const userIdList = this.changeStudentStatusForm.value.studentList.map((user: IStudent) => user.uuid);
    console.log(`userIdList: ${userIdList}`);
    this.managementRestful.updateStudentStatus(userIdList, this.updateStudentStatus).subscribe({
      complete: () => {
        this.isLoading = false;
        this.changeStudentStatusForm.get("studentList")?.setValue([]);
      }
    })
  }
}
