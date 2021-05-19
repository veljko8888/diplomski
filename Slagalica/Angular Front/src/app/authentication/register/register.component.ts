import { HttpBackend, HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FrameService } from 'app/@core/mock/frame.service';
import { UserService } from 'app/@core/mock/users.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  shouldRenderLoginPage = false;
  formSubmitAttempt = false;
  passwordChanged = false;
  accountDisabled = false;
  form: FormGroup = null;
  errorMessage = null;
  successMessage = null;
  formModel = {
    UserName: '',
    Password: ''
  }
  private httpClient: HttpClient;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private httpService: HttpHandlerService,
    private handler: HttpBackend,
    private frameService: FrameService) 
    {
    this.httpClient = new HttpClient(handler);
  }

  ngOnInit() {
    setTimeout(() => {
      this.authService.showRegister = false;
      this.authService.showLogin = true;
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
    this.successMessage = null;
  }

  initForm() {
    this.form = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Sifra: ['', Validators.required],
      Ime: ['', Validators.required],
      Prezime: ['', Validators.required],
      Zanimanje: ['', Validators.required],
      KorisnickoIme: ['', Validators.required],
      Pol: ['', Validators.required],
      SifraPotvrda: [''],
      DatumRodjenja: ['', Validators.required],
      ProfilnaSlika: ['']
    },
      { validators: this.checkPasswords });
  }

  async onSubmit() {
    this.formSubmitAttempt = true;
    if (this.form.valid) {
      this.frameService.showLoaderAuth();
      let formValue = this.form.value;
      await this.httpService.register(formValue, this.httpClient).subscribe(
        (res: any) => {
          //ON SUCCESS
          this.frameService.hideLoaderAuth();
          this.errorMessage = null;
          this.successMessage = 'Uspesno ste kreirali nalog. Nakon što administrator odobri vaš nalog moći ćete da učestvujete u igri.';
        },
        error => {
          this.frameService.hideLoaderAuth();
          this.successMessage = null;
          this.errorMessage = error?.error[0]?.Value ? error?.error[0]?.Value : 'Došlo je do greške prilikom registracije';
          console.log(error);
        });
    }
  }

  navigateForgotPass() {
    this.router.navigate(['/auth/forgotPassword']);
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('Sifra').value;
    const confirmPassword = group.get('SifraPotvrda').value;

    return password === confirmPassword ? null : { notSame: true }
  }
}


