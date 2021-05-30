import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ProjectInfo } from './projectinfo/projectinfo.component';
import { SearchProjectsComponent } from './search-projects/search-projects.component';
import { MyWorkOrdersComponent } from './my-work-orders/my-work-orders.component';
import { WorkOrderDetailsComponent } from './my-work-orders/work-order-details/work-order-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { DailyGameComponent } from './daily-game/daily-game.component';
import { AuthGuard } from 'app/authentication/auth.guard';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { UserPlayComponent } from './user-play/user-play.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    {
      canActivate: [AuthGuard],
      path: 'searchprojects',
       component: SearchProjectsComponent
    },
    {
      canActivate: [AuthGuard],
      path: 'myworkorders',
      component: MyWorkOrdersComponent,
      data:{
        role: "Admin"
      }
    },
    {
      canActivate: [AuthGuard],
      path: 'myworkorders/:workOrderID',
      component: WorkOrderDetailsComponent,
    },
    {
      canActivate: [AuthGuard],
      path: 'projectinfo/:permitId',
      component: ProjectInfo,
    },
    {
      canActivate: [AuthGuard],
      path: 'userDetails',
      component: UserDetailsComponent,
    },
    {
      canActivate: [AuthGuard],
      path: 'dailygame',
      component: DailyGameComponent,
      data:{
        role: "Admin"
      }
    },
    {
      canActivate: [AuthGuard],
      path: 'supervisor',
      component: SupervisorComponent,
      data:{
        role: "Supervizor"
      }
    },
    {
      canActivate: [AuthGuard],
      path: 'user-play',
      component: UserPlayComponent,
      data:{
        role: "Ucesnik"
      }
    },
    
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {
}
