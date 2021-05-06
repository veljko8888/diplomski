import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  token = 'bWdvYXBpYWRtaW5AbWdvLm9yZzoyfWYodlZMOGVSOzI5WnZAZUd2ISEsfg==';

  constructor(private router: Router) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem('token') != null) {
      const clonedReq = req.clone({});
      // const clonedReq = req.clone({
      //   headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
      // });
      let decodedToken = jwt_decode<any>(localStorage.getItem('token'));
      if (!(decodedToken.client_id == "4bnjfalv1h7d1pbgde56nl132b"
        && decodedToken.iss == "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_m2q58Yol0"
        && decodedToken.scope == "openid profile" && decodedToken.token_use == "access")) {
        localStorage.removeItem('token');
        this.router.navigateByUrl('/');
      }
      if(req.url.includes('https://api.mgoconnect.org/jpv2/')) {
        req = req.clone({
          setHeaders: {
              Authorization: `Basic ${this.token}`
          }
      });
      return next.handle(req);
      }
      return next.handle(clonedReq);
    }
    else {
      localStorage.removeItem('token');
      this.router.navigateByUrl('/user/login');
      return next.handle(req.clone());
    }

  }
}
