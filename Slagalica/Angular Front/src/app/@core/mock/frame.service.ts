import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { NbComponentStatus } from '@nebular/theme/components/component-status';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FrameService {

  constructor(
    private toastrService: NbToastrService
  ) { }

  private loader: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private loaderAuth: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private toast: BehaviorSubject<any> = new BehaviorSubject(null);

  public readonly loader$: Observable<boolean> = this.loader.asObservable();
  public readonly loaderAuth$: Observable<boolean> = this.loaderAuth.asObservable();
  public readonly toast$: Observable<any> = this.toast.asObservable();


  hideLoader() {
    this.loader.next(false);
  }

  showLoader() {
    this.loader.next(true);
  }

  hideLoaderAuth() {
    this.loaderAuth.next(false);
  }

  showLoaderAuth() {
    this.loaderAuth.next(true);
  }

  showToast(title: string, msg: string, status: NbComponentStatus, duration: number = 3000) {
    this.toastrService.show(msg, title, { status, duration });
  }

  showToastPrime(summary: string, message: string, severity: string, duration: number, closable: boolean = false, sticky: boolean = false) {
    let toastObj = { summary: summary, message: message, severity: severity, duration: duration, closable: closable, sticky: sticky };
    this.toast.next(toastObj);
  }

  destroyAllToasts(){
    let destroyObj = { destroyAll: true }
    this.toast.next(destroyObj);
  }
}
