import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FrameService } from 'app/@core/mock/frame.service';

@Component({
  selector: 'ngx-auth-wrapper',
  templateUrl: './auth-wrapper.component.html',
  styleUrls: ['./auth-wrapper.component.scss']
})
export class AuthWrapperComponent implements OnInit {

  loading: boolean = false;

  constructor(
    private frameService: FrameService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.frameService.loaderAuth$.subscribe((data) => {
      this.loading = data;
      this.cdr.detectChanges();
    });
  }
}
