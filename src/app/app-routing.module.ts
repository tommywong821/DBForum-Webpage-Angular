import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "@auth0/auth0-angular";

const routes: Routes = [
  {
    path: 'mainpage',
    loadChildren: () => import('./layout/route-page/main-page/main-page.module').then(m => m.MainPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./layout/route-page/dashboard-page/dashboard-page.module').then(m => m.DashboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'management',
    loadChildren: () => import('./layout/route-page/management-page/management-page.module').then(m => m.ManagementPageModule),
    canActivate: [AuthGuard]
  },
  {path: '**', redirectTo: 'mainpage', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
