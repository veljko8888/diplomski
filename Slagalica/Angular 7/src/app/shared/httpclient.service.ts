import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient) { }

  readonly BaseURI = 'http://localhost:58701/api';

  readonly JPApiBaseURI = 'https://demo.mypermitnow.org/api'
  readonly JPAPIBaseURITunnel = 'https://d314b468a522.ngrok.io/api'

  formModel = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', Validators.email],
    FullName: [''],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.comparePasswords })

  });

  comparePasswords(fb: FormGroup) {
    let confirmPswrdCtrl = fb.get('ConfirmPassword');
    //passwordMismatch
    //confirmPswrdCtrl.errors={passwordMismatch:true}
    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (fb.get('Password').value != confirmPswrdCtrl.value)
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      else
        confirmPswrdCtrl.setErrors(null);
    }
  }

  register() {
    var body = {
      Username: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      FullName: this.formModel.value.FullName,
      Password: this.formModel.value.Passwords.Password
    };
    return this.http.post(this.BaseURI + '/Authentication/Register', body);
  }

  login(formData) {
    return this.http.post(this.BaseURI + '/Authentication/Login', formData);
  }

  confirmRegistration(userId: string, token: string) {
    return this.http.get(this.BaseURI + `/Authentication?userId=${userId}&token=${token}`);
  }

  getUserProfile() {
    return this.http.get(this.BaseURI + '/User/UserProfile');
  }

  getChecklists() {

    // var auth = $base64.encode("foo:bar"),
    //   headers = { "Authorization": "Basic " + auth };
    // $http.get(url, { headers: headers })

    var checklistsURL = this.JPAPIBaseURITunnel + '/permit/4712269/reviewChecklist';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('jerryt@scpdc.org:jerryt3764')
      })
    };
    return this.http.get(checklistsURL, httpOptions);
  }

  getLexicons() {
    return this.http.get(this.BaseURI + '/Lexicon/LexiconData');
  }

  removeLexicon(lexicon: any) {
    return this.http.post(this.BaseURI + '/Lexicon/RemoveLexicon', lexicon);
  }

  addLexicon(lexicon: any) {
    return this.http.post(this.BaseURI + '/Lexicon/SaveLexicon', lexicon);
  }
}
