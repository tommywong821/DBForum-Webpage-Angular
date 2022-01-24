import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from "./layout/main-page/main-page.component";
import {DashboardComponent} from "./layout/dashboard/dashboard.component";
import {TestMainComponent} from "./test-main/test-main.component";

const routes: Routes = [
  {path: 'mainpage', component: MainPageComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'test', component: TestMainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
