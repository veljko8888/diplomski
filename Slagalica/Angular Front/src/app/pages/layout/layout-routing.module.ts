import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
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
