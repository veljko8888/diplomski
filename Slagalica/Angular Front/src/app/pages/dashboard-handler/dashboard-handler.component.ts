import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { UserService } from 'app/@core/mock/users.service';
import { TipKorisnika } from 'enums';

@Component({
  selector: 'ngx-dashboard-handler',
  templateUrl: './dashboard-handler.component.html',
  styleUrls: ['./dashboard-handler.component.scss']
})
export class DashboardHandlerComponent implements OnInit {

  constructor(
    private httpService: HttpHandlerService,
    private userService: UserService,
    private router: Router
  ) { }

  async ngOnInit() {
    if (localStorage.getItem('token') != null) {
      let currentUser = this.userService.getCurrentUser();
      if (!currentUser) {
        await this.httpService.getUserProfile().subscribe(
          (res: any) => {
            this.userService.saveLoggedInUser(res);
            this.handleRoles(res);
          },
          error => {
            console.log(error);
          });
      }
      else {
        this.handleRoles(currentUser);
      }
    }
    else {
      this.router.navigate(['/']);
    }
  }

  handleRoles(currentUser: any) {
    if (currentUser.tipKorisnika == TipKorisnika.Admin) {
      this.router.navigate(['/pages']);
    }
    else if (currentUser.tipKorisnika == TipKorisnika.Supervizor) {
      this.router.navigate(['/pages/layout/supervisor']);
    }
    else if (currentUser.tipKorisnika == TipKorisnika.Ucesnik) {
      this.router.navigate(['/pages/layout/user-play']);
    }
    else {
      this.router.navigate(['/auth/no-access']);
    }
  }
}
