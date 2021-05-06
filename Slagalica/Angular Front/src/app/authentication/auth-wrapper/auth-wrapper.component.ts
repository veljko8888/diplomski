import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FrameService } from 'app/@core/mock/frame.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'ngx-auth-wrapper',
  templateUrl: './auth-wrapper.component.html',
  styleUrls: ['./auth-wrapper.component.scss']
})
export class AuthWrapperComponent implements OnInit {

  loading: boolean = false;

  constructor(
    private frameService: FrameService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.frameService.loaderAuth$.subscribe((data) => {
      this.loading = data;
      this.cdr.detectChanges();
    });
  }

  navigateRegisterPage(){
    this.router.navigate(['/auth/forgotPassword']);
  }
}
