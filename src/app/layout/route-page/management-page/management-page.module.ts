import {NgModule} from "@angular/core";
import {ManagementPageComponent} from "./management-page.component";
import {CommonModule} from "@angular/common";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {ReactiveFormsModule} from "@angular/forms";
import {ManagementPageRoutingModule} from "./management-page-routing.module";
import {StudentRoleComponent} from './student-role/student-role.component';
import {CoachComponent} from './coach/coach.component';
import {MainPageModule} from "../main-page/main-page.module";

@NgModule({
  declarations: [
    ManagementPageComponent,
    StudentRoleComponent,
    CoachComponent
  ],
  imports: [
    CommonModule,
    ManagementPageRoutingModule,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule,
    MainPageModule,
  ]
})
export class ManagementPageModule {
}
