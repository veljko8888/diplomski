import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FrameService } from 'app/@core/mock/frame.service';
import { UserService } from 'app/@core/mock/users.service';
import { AuthService } from '../auth.service';
import jwt_decode from 'jwt-decode';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { environment } from 'environments/environment';
import { HttpBackend, HttpClient } from '@angular/common/http';


@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  shouldRenderLoginPage = false;
  formSubmitAttempt = false;
  passwordChanged = false;
  accountDisabled = false;
  form: FormGroup = null;
  errorMessage = null;

  httpClient: HttpClient;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private httpService: HttpHandlerService,
    private handler: HttpBackend,
    private frameService: FrameService
  ) {
    this.httpClient = new HttpClient(handler);
  }

  ngOnInit() {
    setTimeout(() => {
      this.authService.showRegister = true;
      this.authService.showLogin = false;
      this.authService.showGuest = true;
    }, 0);
    if (localStorage.getItem('passwordChanged')) {
      this.passwordChanged = true;
    }
    if (localStorage.getItem('accDisabled')) {
      this.accountDisabled = true;
    }
    localStorage.removeItem('accDisabled');
    localStorage.removeItem('passwordChanged');
    this.authService.loginError = null;
    this.initForm();
  }

  ngOnDestroy() {
    this.accountDisabled = false;
    this.passwordChanged = false;
    this.errorMessage = null;
  }

  initForm() {
    this.form = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required]
    });
  }

  async onSubmit() {
    this.formSubmitAttempt = true;
    if (this.form.valid) {
      this.frameService.showLoaderAuth();
      let formValue = this.form.value;
      await this.httpService.login(formValue, this.httpClient).subscribe(
        (res: any) => {
          //ON SUCCESS
          localStorage.setItem('token', res.token);
          this.router.navigate(['/pages/dashboard-handler']);
          this.frameService.hideLoaderAuth();
          this.errorMessage = null;
        },
        error => {
          this.frameService.hideLoaderAuth();
          this.errorMessage = error?.error[0]?.Value ? error?.error[0]?.Value : 'Došlo je do greške prilikom prijavljivanja';
          console.log(error);
        });
    }
  }

  // async checkIfSessionAlreadyExists() {
  //   if (localStorage.getItem('token') != null) {
  //     if (this.userService.getCurrentUser()) {
  //       this.router.navigate(['/pages'])
  //     }
  //     else {
  //       let decodedToken = jwt_decode<any>(localStorage.getItem('token'));
  //       this.httpService.getLoggedInUser(decodedToken.sub).subscribe(
  //         (res: any) => {
  //           if (!res.IsApproved || res.IsUnapprovedUser) {
  //             //dodaj poruku za account disabled please contact support
  //             localStorage.setItem('accDisabled', '1');
  //             this.authService.logoutUserFromCognito();
  //             this.router.navigate(['/']);
  //           }
  //           else {
  //             this.userService.saveLoggedInUser(res);
  //             this.router.navigate(['/pages']);
  //           }
  //         },
  //         error => {
  //           this.authService.logoutUserFromCognito();
  //           this.router.navigate(['/']);
  //         });
  //     }
  //   }
  //   else {
  //     this.shouldRenderLoginPage = true;
  //   }
  // }

  navigateForgotPass() {
    this.router.navigate(['/auth/forgotPassword']);
  }
}

