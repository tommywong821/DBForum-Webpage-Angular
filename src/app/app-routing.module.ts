import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from "./layout/main-page/main-page.component";
import {AuthGuard} from "@auth0/auth0-angular";

const routes: Routes = [
  {path: 'mainpage', component: MainPageComponent},
  {
    path: 'dashboard',
    loadChildren: () => import('./layout/dashboard-page/dashboard-page.module').then(m => m.DashboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'management',
    loadChildren: () => import('./layout/management-page/management-page.module').then(m => m.ManagementPageModule),
    canActivate: [AuthGuard]
  },

  {path: '**', redirectTo: 'mainpage', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
