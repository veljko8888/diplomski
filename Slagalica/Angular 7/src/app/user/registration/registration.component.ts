
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClientService } from './../../shared/httpclient.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: []
})
export class RegistrationComponent implements OnInit {

  constructor(
    public service: HttpClientService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.service.formModel.reset();
  }

  onSubmit() {
    this.service.register().subscribe(
      (res: any) => {
        this.service.formModel.reset();
        this.toastr.success('Check mailbox for confirmation!', 'User Created');
      },
      error => {
        error.error.forEach(error => {
          this.toastr.error(error.Value, 'Registration failed.');
        });
      }
    );
  }

}
