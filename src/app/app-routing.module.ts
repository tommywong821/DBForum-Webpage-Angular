import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from "./layout/main-page/main-page.component";
import {TestMainComponent} from "./test-main/test-main.component";
import {AuthGuard} from "@auth0/auth0-angular";
import {DashboardComponent} from "./layout/dashboard/dashboard.component";

const routes: Routes = [
  {path: 'mainpage', component: MainPageComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'test', component: TestMainComponent},
  {path: '**', redirectTo: 'mainpage', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
