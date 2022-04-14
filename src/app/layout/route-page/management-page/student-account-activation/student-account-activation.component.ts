import {Component, OnInit} from '@angular/core';
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {ForumBackendManagementService} from "../../../../services/aws-lambda/forum-backend-management.service";
import {IStudent} from "../../../../model/forum/IStudent";

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

  constructor(private managementRestful: ForumBackendManagementService) {
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
  }

  ngOnInit(): void {
  }

  onActionSelect(event: any) {
    this.isLoading = true;
    console.log(`onActionSelect: `, event);
    this.managementRestful.getStudent((event.action_id == "active")).subscribe({
      next: (studentList) => {
        this.studentListByStatus = studentList;
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  onActionDeSelect() {
    this.studentListByStatus = [];
  }

  onStudentSelect(event: any) {
    console.log(`onStudentSelect: `, event)
  }
}
