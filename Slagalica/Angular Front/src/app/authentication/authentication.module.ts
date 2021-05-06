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
  NbLayoutModule,
  NbSpinnerModule,
} from '@nebular/theme';

import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { LoginComponent } from './login/login.component';
import { AuthWrapperComponent } from './auth-wrapper/auth-wrapper.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotPasswordVerificationComponent } from './forgot-password-verification/forgot-password-verification.component';

@NgModule({
  imports: [
    NbLayoutModule,
    FormsModule,
    ReactiveFormsModule,
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
    NbSpinnerModule,
    AuthenticationRoutingModule,
    CommonModule,

    TabViewModule,
    ConfirmDialogModule,
    TooltipModule,
    AccordionModule,
    TableModule
  ],
  declarations: [
    LoginComponent,
    AuthWrapperComponent,
    ForgotPasswordComponent,
    ForgotPasswordVerificationComponent
  ],
  providers: [
    ConfirmationService,
    AuthService
  ],
})
export class AuthenticationModule { }
