import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbAccordionModule,
  NbButtonModule,
  NbCardModule,
  NbListModule,
  NbRouteTabsetModule,
  NbStepperModule,
  NbTabsetModule,
  NbActionsModule,
  NbCheckboxModule,
  NbDatepickerModule, 
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbDialogModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { ProjectInfo } from './projectinfo/projectinfo.component';
import { OnlyNumberDirective } from 'app/@core/utils/only-number.directive';

import {TabViewModule} from 'primeng/tabview';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {TooltipModule} from 'primeng/tooltip';
import {AccordionModule} from 'primeng/accordion';
import {TableModule} from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ToggleButtonModule} from 'primeng/togglebutton';
import { DialogModule } from 'primeng/dialog';
import {DynamicDialogModule} from 'primeng/dynamicdialog';


import { SearchProjectsComponent } from './search-projects/search-projects.component';
import { MyWorkOrdersComponent } from './my-work-orders/my-work-orders.component';
import { WorkOrderDetailsComponent } from './my-work-orders/work-order-details/work-order-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    NbActionsModule,
    NbCheckboxModule,
    NbDatepickerModule, 
    NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    LayoutRoutingModule,
    ToggleButtonModule,
    TabViewModule,
    ConfirmDialogModule,
    TooltipModule,
    AccordionModule,
    TableModule,
    InputTextModule,
    RadioButtonModule,
    DialogModule,
    NbDialogModule,
    DynamicDialogModule
   
  ],
  declarations: [
    LayoutComponent,
    ProjectInfo,
    OnlyNumberDirective,
    SearchProjectsComponent,
    MyWorkOrdersComponent,
    WorkOrderDetailsComponent,
    UserDetailsComponent,
  ],
  providers: [
    ConfirmationService
  ],
})
export class LayoutModule { }
