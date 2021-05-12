import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FrameService } from 'app/@core/mock/frame.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'ngx-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  form: FormGroup = null;
  formSubmitAttempt = false;
  errorMsg = null;
  headerText = 'Promena Lozinke';
  successMessage = null;
  errorMessage = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private frameService: FrameService,
    public authService: AuthService,
    private httpService: HttpHandlerService
  ) { }

  ngOnInit(): void {
    setTimeout( () => { 
      this.authService.showRegister = false; 
      this.authService.showLogin = true;
    }, 0 );
    
    if (localStorage.getItem('resetPassword')) {
      this.headerText = 'Please Reset Your Password';
    }
    localStorage.removeItem('resetPassword');
    this.initForm();
  }

  ngOnDestroy(){
    this.errorMessage = null;
    this.successMessage = null;
  }

  initForm() {
    this.form = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      StariPassword: ['', Validators.required],
      NoviPassword: ['', Validators.required]
    });
  }

  async onSubmit() {
    this.formSubmitAttempt = true;
    if (this.form.valid) {
      this.frameService.showLoaderAuth();
      let formValue = this.form.value;
      await this.httpService.changePass(formValue).subscribe(
        (res: any) => {
          this.frameService.hideLoaderAuth();
          this.errorMessage = null;
          this.successMessage = 'Uspesno ste promenili lozinku.';
        },
        error => {
          this.frameService.hideLoaderAuth();
          this.successMessage = null;
          this.errorMessage = error?.error[0]?.Value ? error?.error[0]?.Value : 'Došlo je do greške prilikom promene lozinke.'
          console.log(error);
        });
    }
  }

}
