import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FrameService } from 'app/@core/mock/frame.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'ngx-forgot-password-verification',
  templateUrl: './forgot-password-verification.component.html',
  styleUrls: ['./forgot-password-verification.component.scss']
})
export class ForgotPasswordVerificationComponent implements OnInit {

  form: FormGroup = null;
  formSubmitAttempt = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private frameService: FrameService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required],
      VerificationCode: ['', Validators.required]
    });
  }

  // async onSubmit() {
  //   this.formSubmitAttempt = true;
  //   if (this.form.valid) {
  //     try {
  //       this.frameService.showLoaderAuth();
  //       let response = Auth.forgotPasswordSubmit(this.form.value.Email, this.form.value.VerificationCode, this.form.value.Password);
  //       localStorage.setItem('passwordChanged', '1');
  //       this.frameService.hideLoaderAuth();
  //       this.router.navigate(['/auth/login']);
  //     } catch (error) {
  //       this.frameService.hideLoaderAuth()
  //       //console.log(error);
  //     }
  //   }
  // }

}
