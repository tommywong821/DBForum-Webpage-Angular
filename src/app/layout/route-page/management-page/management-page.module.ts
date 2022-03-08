import {NgModule} from "@angular/core";
import {ManagementPageComponent} from "./management-page.component";
import {CommonModule} from "@angular/common";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {ReactiveFormsModule} from "@angular/forms";
import {ManagementPageRoutingModule} from "./management-page-routing.module";

@NgModule({
  declarations: [
    ManagementPageComponent
  ],
  imports: [
    CommonModule,
    ManagementPageRoutingModule,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule,
  ]
})
export class ManagementPageModule {
}
