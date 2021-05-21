import { HttpBackend, HttpClient } from '@angular/common/http';
import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FrameService } from 'app/@core/mock/frame.service';
import { AuthService } from '../auth.service';
import { CustomValidators } from '../custom-validators';

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

  httpClient: HttpClient;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private frameService: FrameService,
    public authService: AuthService,
    private httpService: HttpHandlerService,
    private handler: HttpBackend
  ) {
    this.httpClient = new HttpClient(handler);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.authService.showRegister = false;
      this.authService.showLogin = true;
      this.authService.showGuest = true;
    }, 0);

    if (localStorage.getItem('resetPassword')) {
      this.headerText = 'Please Reset Your Password';
    }
    localStorage.removeItem('resetPassword');
    this.initForm();
  }

  ngOnDestroy() {
    this.errorMessage = null;
    this.successMessage = null;
  }

  initForm() {
    this.form = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      StariPassword: ['', Validators.required],
      NoviPassword: ['', [Validators.required, Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        // check whether the entered password has upper case letter
        CustomValidators.patternValidator(/[A-Z]/, {
          hasCapitalCase: true
        }),
        // check whether the entered password has at least one numeric char
        CustomValidators.patternValidator(/^\D*(?:\d\D*){1,}$/, {
          hasMinimumOneNumeric: true
        }),
        // check whether the entered passwords first character is alphanumeric
        CustomValidators.patternValidator(/^[0-0a-zA-Z]{1}/, {
          startsWithAlphanumeric: true
        }),
        // check whether the entered passwords contains minimum 3 lowercase letters
        CustomValidators.patternValidator(/(?=(?:[^a-z]*[a-z]){3})/, {
          minimumThreeLowerCaseLetters: true
        }),
        // check whether the entered passwords contains 3 or more of the same characters in a sequence
        // CustomValidators.patternValidator(/^([a-z])\1+$/, { //(/(?!.*([A-Za-z0-9])\1{2})/, {
        //   threeOrMoreSameCharsInSequence: true
        // }),
        // check whether the entered password has a special character
        CustomValidators.patternValidator(
          /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
          {
            hasSpecialCharacters: true
          }
        ),
      ])]],
    },
      { validators: [this.stringCheck] });
  }

  stringCheck(group: FormGroup) {
    const password = group.get('NoviPassword').value;
    for (var i = 0; i < password.length; i++)
      if (password[i] === password[i + 1] && password[i + 1] === password[i + 2])
        return { threeInSequence: true };

    return null;
  }

  async onSubmit() {
    this.formSubmitAttempt = true;
    if (this.form.valid) {
      this.frameService.showLoaderAuth();
      let formValue = this.form.value;
      await this.httpService.changePass(formValue, this.httpClient).subscribe(
        (res: any) => {
          this.frameService.hideLoaderAuth();
          this.errorMessage = null;
          this.successMessage = 'Uspesno ste promenili lozinku.';
        },
        error => {
          this.frameService.hideLoaderAuth();
          this.successMessage = null;
          this.errorMessage = error?.error[0]?.value ? error.error[0].value : 'Došlo je do greške prilikom promene lozinke.'
          console.log(error);
        });
    }
  }

}
