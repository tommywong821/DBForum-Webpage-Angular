import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardPageComponent} from "./dashboard-page.component";
import {DashboardPageRoutingModule} from "./dashboard-page-routing.module";

@NgModule({
  declarations: [
    DashboardPageComponent
  ],
  imports: [
    CommonModule,
    DashboardPageRoutingModule
  ]
})
export class DashboardPageModule {
}
