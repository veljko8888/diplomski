import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ProjectInfo } from './projectinfo/projectinfo.component';
import { SearchProjectsComponent } from './search-projects/search-projects.component';
import { MyWorkOrdersComponent } from './my-work-orders/my-work-orders.component';
import { WorkOrderDetailsComponent } from './my-work-orders/work-order-details/work-order-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    {
      path: 'searchprojects',
       component: SearchProjectsComponent
    },
    {
      path: 'myworkorders',
      component: MyWorkOrdersComponent,
    },
    {
      path: 'myworkorders/:workOrderID',
      component: WorkOrderDetailsComponent,
    },
    {
      path: 'projectinfo/:permitId',
      component: ProjectInfo,
    },
    {
      path: 'userDetails',
      component: UserDetailsComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {
}
