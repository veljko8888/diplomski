import { ToastrService } from 'ngx-toastr';
import { HttpClientService } from './../../shared/httpclient.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  formModel = {
    UserName: '',
    Password: ''
  }
  constructor(
    private service: HttpClientService, 
    private router: Router, 
    private toastr: ToastrService) { }

  ngOnInit() {
    if (localStorage.getItem('token') != null)
      this.router.navigateByUrl('/home');
  }

  onSubmit(form: NgForm) {
    this.service.login(form.value).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('/home');
      },
      error => {
        error.error.forEach(error => {
          this.toastr.error(error.Value, 'Authentication failed.');
        });
      }
    );
  }
}
