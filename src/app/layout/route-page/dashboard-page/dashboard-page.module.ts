import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardPageComponent} from "./dashboard-page.component";
import {DashboardPageRoutingModule} from "./dashboard-page-routing.module";
import {NgbDatepickerModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    DashboardPageComponent
  ],
  imports: [
    CommonModule,
    DashboardPageRoutingModule,
    NgbDatepickerModule
  ]
})
export class DashboardPageModule {
}
