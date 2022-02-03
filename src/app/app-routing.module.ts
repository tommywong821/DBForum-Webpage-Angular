import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from "./layout/main-page/main-page.component";

const routes: Routes = [
  {path: 'mainpage', component: MainPageComponent},
  // {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  // {path: 'test', component: TestMainComponent},
  {path: '**', redirectTo: 'mainpage', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
