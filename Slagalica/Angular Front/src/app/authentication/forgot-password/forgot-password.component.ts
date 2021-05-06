import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FrameService } from 'app/@core/mock/frame.service';

@Component({
  selector: 'ngx-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup = null;
  formSubmitAttempt = false;
  errorMsg = null;
  headerText = 'Forgot your password?';
  formModel = {
    UserName: '',
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private frameService: FrameService
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('resetPassword')){
      this.headerText = 'Please Reset Your Password';
    }
    localStorage.removeItem('resetPassword');
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
    });
  }

  // async onSubmit() {
  //   this.formSubmitAttempt = true;
  //   if (this.form.valid) {
  //     try {
  //       this.frameService.showLoaderAuth();
  //       const result = await Auth.forgotPassword(this.form.value.Email);
  //       this.frameService.hideLoaderAuth();
  //       this.router.navigate(['/auth/forgotPasswordVerification']);
  //     } catch (error) {
  //       this.frameService.hideLoaderAuth();
  //       //console.log(error);
  //     }
  //   }
  // }

}
