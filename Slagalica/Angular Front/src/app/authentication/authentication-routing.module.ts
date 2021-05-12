import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NbAuthComponent } from '@nebular/auth';
import { AuthWrapperComponent } from './auth-wrapper/auth-wrapper.component';
import { ForgotPasswordVerificationComponent } from './forgot-password-verification/forgot-password-verification.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [{
    path: '',
    component: AuthWrapperComponent,//AuthWrapperComponent,
    children: [
        {
            path: '',
            redirectTo: 'login',
            pathMatch: 'full',
        },
        {
            path: 'login',
            component: LoginComponent,
        },
        {
            path: 'forgotPassword',
            component: ForgotPasswordComponent,
        },
        {
            path: 'forgotPasswordVerification',
            component: ForgotPasswordVerificationComponent,
        },
        {
            path: 'register',
            component: RegisterComponent,
        }
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthenticationRoutingModule {
}
