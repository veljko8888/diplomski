import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FrameService } from 'app/@core/mock/frame.service';
import { UserService } from 'app/@core/mock/users.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginError = null;
  passwordChangedSuccessfully = false;

  currentUser = null;
  showRegister = true;
  showLogin = false;

  private httpClient: HttpClient;

  constructor(
    private router: Router,
    private frameService: FrameService,
    private httpService: HttpHandlerService,
    private userService: UserService,
    private handler: HttpBackend
  ) { 
    this.httpClient = new HttpClient(handler);
  }

  // async signIn(username: string, password: string) {
  //   this.loginError = null;
  //   try {
  //     this.frameService.showLoaderAuth();
  //     //const user = await Auth.signIn(username, password);
  //     //Auth.completeNewPassword(user, "Veljko1994$");
  //     if (user.signInUserSession?.getAccessToken()?.getJwtToken()) {
  //       await this.httpService.getLoggedInUser(user.username).subscribe(
  //         (res: any) => {
  //           if (!res.IsApproved || res.IsUnapprovedUser) {
  //             //dodaj poruku za account disabled please contact support
  //             localStorage.setItem('accDisabled', '1');
  //             this.signOut();
  //           }
  //           else {
  //             this.userService.saveLoggedInUser(res);
  //             this.frameService.hideLoaderAuth();
  //             this.router.navigate(['/pages']);
  //           }
  //         },
  //         error => {
  //           this.frameService.hideLoaderAuth();
  //           this.signOut();
  //         });
  //     }
  //   } catch (error) {
  //     if (error.code == 'PasswordResetRequiredException') {
  //       localStorage.setItem('resetPassword', '1');
  //       this.router.navigate(['/auth/forgotPassword']);
  //     }
  //     this.loginError = error;
  //     this.frameService.hideLoaderAuth();
  //     this.frameService.showToastPrime('Error!', 'Failed to Log In', 'error', 4000);
  //   }
  // }

  // async signOut() {
  //   try {
  //     this.frameService.showLoader();
  //     await Auth.signOut();
  //     this.frameService.hideLoader();
  //     this.router.navigate(['/auth/login']);
  //   } catch (error) {
  //     this.frameService.hideLoader();
  //     this.frameService.showToastPrime('Error!', 'Failed to Log Out.', 'error', 4000);
  //   }
  // }

  // public getTokenDetailsFromCognito(callbackCode: string): Observable<any> {
  //   const details = {
  //     grant_type: 'authorization_code',
  //     code: callbackCode,
  //     scope: 'openid+profile',
  //     redirect_uri: environment.redirectURL
  //   };
  //   const formBody = Object.keys(details)
  //     .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(details[key])}`)
  //     .join('&');

  //   return this.httpClient.post<any>(environment.cognitoTokenURL,
  //     formBody, {
  //     responseType: 'json',
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       Authorization: 'Basic ' + btoa(`${environment.sso_api_username}:${environment.sso_api_pwd}`)
  //     })
  //   });
  // }

  // public logoutUserFromCognito(): Observable<any> {
  //   localStorage.removeItem('token');
  //   return this.httpClient.get<any>(environment.logout);
  // }

  // signOutSSO() {
  //   localStorage.removeItem('token');
  //   window.location.assign(environment.logout);
  // }
}
