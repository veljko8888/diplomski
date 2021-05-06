import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../shared/httpclient.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.component.html',
  styleUrls: ['./confirm-registration.component.scss']
})
export class ConfirmRegistrationComponent implements OnInit {

  constructor(
    private service: HttpClientService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  registrationMsg = 'Waiting for user registration confirmation...';
  detailError = '';

  ngOnInit(): void {
    var userId = this.route.snapshot.params['userId'];
    var token = this.route.snapshot.params['token'];
    this.service.confirmRegistration(userId, token).subscribe(
      (res: any) => {
        this.registrationMsg = 'Successfully confirmed! You will be redirected to login page in few moments...'
        setTimeout(() => {
          this.router.navigateByUrl('/home');
        }, 5000);
      },
      error => {
        error.error.forEach(error => {
          this.detailError += error.Value + '\n';
        });
        this.registrationMsg = 'Registration Failed! You will be redirected to login page in few moments...'
        setTimeout(() => {
          this.router.navigateByUrl('/home');
        }, 5000);
      }
    );
  }

}
