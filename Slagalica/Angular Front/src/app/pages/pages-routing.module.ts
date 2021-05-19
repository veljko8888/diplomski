import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AuthGuard } from 'app/authentication/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHandlerComponent } from './dashboard-handler/dashboard-handler.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    // {
    //   path: 'auth',
    //   loadChildren: () => import('./auth/auth.module')
    //     .then(m => m.AuthModule),
    // },
    {
      path: 'dashboard',
      canActivate: [AuthGuard],
      component: DashboardComponent,
      data:{
        role: "Admin"
      },
    },
    {
      path: 'dashboard-handler',
      component: DashboardHandlerComponent,
    },
    {
      path: 'layout',
      //canActivate: [AuthGuard],
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
