import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FormValidationService } from 'app/@core/mock/form-validation.service';
import { FrameService } from 'app/@core/mock/frame.service';
import { UserService } from 'app/@core/mock/users.service';

@Component({
  selector: 'ngx-dashboard',
  template: ``,
})
export class DashboardComponent implements OnInit {

  constructor(
    private httpService: HttpHandlerService,
    private frameService: FrameService,
    public formValidationService: FormValidationService,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  checked: boolean = false;

  async ngOnInit() {
    if (!this.userService.getCurrentUser()) {
      this.frameService.showLoader();

      await this.httpService.getUserProfile().subscribe(
        (res: any) => {
          this.userService.saveLoggedInUser(res);
          this.frameService.showToastPrime('Zdravo!', 'Uspešna prijava na sistem, dobrodošli.', 'success', 4000);
          this.frameService.hideLoader();
        },
        error => {
          this.frameService.hideLoader();
          this.frameService.showToastPrime('Ups!', 'Došlo je do greške prilikom prijave na sistem.', 'error', 4000);
          console.log(error);
        });
    }

  }
}
