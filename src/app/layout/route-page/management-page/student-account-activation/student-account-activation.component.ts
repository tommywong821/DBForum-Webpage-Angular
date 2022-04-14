import {Component, OnInit} from '@angular/core';
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {ForumBackendManagementService} from "../../../../services/aws-lambda/forum-backend-management.service";

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


  constructor(private managementRestful: ForumBackendManagementService) {
    this.actionDropDownSetting = {
      singleSelection: true,
      idField: 'action_id',
      textField: 'action_text'
    };
  }

  ngOnInit(): void {
  }

  onActionSelect(event: any) {
    console.log(`onActionSelect: `, event);
    this.managementRestful.getStudent((event.action_id == "active")).subscribe({
      next: value => {

      }
    })
  }
}
