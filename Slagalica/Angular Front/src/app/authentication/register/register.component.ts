import { HttpBackend, HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, Testability } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FrameService } from 'app/@core/mock/frame.service';
import { UserService } from 'app/@core/mock/users.service';
import { AuthService } from '../auth.service';
import { CustomValidators } from '../custom-validators';

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
  fileToUpload: File;
  imageUrl: string;
  imgSizeWrong: any = false;
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
    private frameService: FrameService) {
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

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    this.imgSizeWrong

    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      //Initiate the JavaScript Image object.
      var image = new Image();

      //Set the Base64 string return from FileReader as source.
      image.src = event.target.result;
      let imgbrt = this.imgSizeWrong;

      //Validate the File Height and Width.
      this.imgSizeWrong = this.detect(image, imgbrt, function(result){
        return result;
      });

      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  detect(image: any, imageSizeWrong: boolean, callback) {
    image.onload = function () {
      var height = image.height;
      var width = image.width;
      if (height > 300 || width > 300) {
        callback(true);
      }
      else{
        callback(false);
      }
    };
  }

  initForm() {
    this.form = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Sifra: ['', [Validators.required, Validators.compose([
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
      ])]], //.pattern('[0-9a-zA-Z]{2,5}')]],
      Ime: ['', Validators.required],
      Prezime: ['', Validators.required],
      Zanimanje: ['', Validators.required],
      KorisnickoIme: ['', Validators.required],
      Pol: ['', Validators.required],
      SifraPotvrda: [''],
      DatumRodjenja: ['', Validators.required],
      ProfilnaSlika: ['']
    },
      { validators: [this.checkPasswords, this.stringCheck] });
  }

  stringCheck(group: FormGroup) {
    const password = group.get('Sifra').value;
    for (var i = 0; i < password.length; i++)
      if (password[i] === password[i + 1] && password[i + 1] === password[i + 2])
        return { threeInSequence: true };

    return null;
  }

  formatDate(date: any) {
    let dateString = '';
    if (date != null) {
      let dd = date.getDate();
      let mm = date.getMonth() + 1;
      const yyyy = date.getFullYear();
      if (dd < 10) {
        dd = `0${dd}`;
      }
      if (mm < 10) {
        mm = `0${mm}`;
      }
      dateString = `${yyyy}-${mm}-${dd}`;
    }

    return dateString;
  }

  async onSubmit() {
    this.formSubmitAttempt = true;
    if (this.form.valid && !this.imgSizeWrong) {
      this.frameService.showLoaderAuth();
      let formValue = this.form.value;
      const fd = new FormData();
      if(this.fileToUpload){
        fd.append('image', this.fileToUpload, this.fileToUpload?.name);
      }
      
      fd.append('KorisnickoIme', formValue.KorisnickoIme);
      fd.append('Email', formValue.Email);
      fd.append('Ime', formValue.Ime);
      fd.append('Prezime', formValue.Prezime);
      fd.append('Zanimanje', formValue.Zanimanje);
      fd.append('Pol', formValue.Pol);
      fd.append('DatumRodjenja', this.formatDate(formValue.DatumRodjenja));
      fd.append('Sifra', formValue.Sifra);
      await this.httpService.register(fd, this.httpClient).subscribe(
        (res: any) => {
          //ON SUCCESS
          this.frameService.hideLoaderAuth();
          this.errorMessage = null;
          this.successMessage = 'Uspesno ste kreirali nalog. Nakon što administrator odobri vaš nalog moći ćete da učestvujete u igri.';
        },
        error => {
          this.frameService.hideLoaderAuth();
          this.successMessage = null;
          this.errorMessage = error?.error[0]?.value ? error.error[0].value : 'Došlo je do greške prilikom registracije';
          console.log(error);
        });
    }
  }

  navigateForgotPass() {
    this.router.navigate(['/auth/forgotPassword']);
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('Sifra').value;
    //let hasRepeatLetters = this.hasRepeatedLetters(password);
    const confirmPassword = group.get('SifraPotvrda').value;

    return password === confirmPassword ? null : { notSame: true }
  }
}


