import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import {TableModule} from 'primeng/table';

import {
  NbButtonModule,
} from '@nebular/theme';
import { DashboardHandlerComponent } from './dashboard-handler/dashboard-handler.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    MiscellaneousModule,

    TableModule,

    NbButtonModule
  ],
  declarations: [
    PagesComponent,
    DashboardComponent,
    DashboardHandlerComponent,
  ],
})
export class PagesModule {
}
