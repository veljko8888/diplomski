import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserService } from 'app/@core/mock/users.service';
import { AuthService } from './auth.service';
import { TipKorisnika } from '../../enums';
import jwt_decode from 'jwt-decode';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private httpService: HttpHandlerService) {
  }

  public TipKorisnika = TipKorisnika;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
      if (localStorage.getItem('token') != null) {
        let currentUser = this.userService.getCurrentUser();
        if (!currentUser) {
          this.httpService.getUserProfile().subscribe(
            (res: any) => {
              this.userService.saveLoggedInUser(res);
              this.handleRoles(res, resolve, next)
              console.log(this.userService.getCurrentUser());
            },
            error => {
              console.log(error);
            });
        }
        else {
          this.handleRoles(currentUser, resolve, next);
        }
      }
      else {
        this.router.navigate(['/']);
        resolve(false);
      }
    })
  }

  handleRoles(currentUser: any, resolve: any, routeSnapshop: ActivatedRouteSnapshot) {
    if (currentUser.tipKorisnika == TipKorisnika.Admin && routeSnapshop.data.role == "Admin") {
      resolve(true);
    }
    else if (currentUser.tipKorisnika == TipKorisnika.Supervizor && routeSnapshop.data.role == "Supervizor") {
      resolve(true);
    }
    else if (currentUser.tipKorisnika == TipKorisnika.Ucesnik && routeSnapshop.data.role == "Ucesnik") {
      resolve(true);
    }
    else {
      this.router.navigate(['/auth/no-access']);
      resolve(false);
    }
  }
}
