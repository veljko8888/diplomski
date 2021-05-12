import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserService } from 'app/@core/mock/users.service';
import { AuthService } from './auth.service';
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

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
      if (localStorage.getItem('token') != null) {
        if (!this.userService.getCurrentUser()) {
          this.httpService.getUserProfile().subscribe(
            (res: any) => {
              this.userService.saveLoggedInUser(res);
              console.log(this.userService.getCurrentUser());
            },
            error => {
              console.log(error);
            });
        }
        
        resolve(true);
      }
      else {
        this.router.navigate(['/']);
        resolve(false);
      }

      // if (localStorage.getItem('token') != null) {
      //     if (this.userService.getCurrentUser()) {
      //       resolve(true)
      //     }
      //     else {
      //       let decodedToken = jwt_decode<any>(localStorage.getItem('token'));
      //       this.httpService.getLoggedInUser(decodedToken.sub).subscribe(
      //         (res: any) => {
      //           if (!res.IsApproved || res.IsUnapprovedUser) {
      //             //dodaj poruku za account disabled please contact support
      //             localStorage.setItem('accDisabled', '1');
      //             this.authService.logoutUserFromCognito();
      //             this.router.navigate(['/']);
      //             resolve(false);
      //           }
      //           else {
      //             this.userService.saveLoggedInUser(res);
      //             resolve(true)
      //           }
      //         },
      //         error => {
      //           this.authService.logoutUserFromCognito();
      //           this.router.navigate(['/']);
      //           resolve(false)
      //         });
      //     }
      //   }
      //   else {
      //     this.router.navigate(['/auth/login']);
      //     resolve(false)
      //   }
    })
  }
}
