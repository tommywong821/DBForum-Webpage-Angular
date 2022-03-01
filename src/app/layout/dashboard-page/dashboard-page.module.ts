import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardPageComponent} from "./dashboard-page.component";
import {DashboardPageRoutingModule} from "./dashboard-page-routing.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [
    DashboardPageComponent
  ],
  imports: [
    CommonModule,
    DashboardPageRoutingModule,
    FontAwesomeModule
  ]
})
export class DashboardPageModule {
}
