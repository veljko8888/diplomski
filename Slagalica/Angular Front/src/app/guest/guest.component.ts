import { HttpBackend, HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FrameService } from 'app/@core/mock/frame.service';

@Component({
  selector: 'ngx-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent implements OnInit {

  constructor(
    private httpService: HttpHandlerService,
    private frameService: FrameService,
    private handler: HttpBackend,
    private cdr: ChangeDetectorRef
  ) {
    this.httpClient = new HttpClient(handler);
  }

  loading: boolean = false;
  rankings: any;
  rankCounter: number = 1;
  httpClient: HttpClient;

  async ngOnInit() {
    this.frameService.loaderAuth$.subscribe((data) => {
      this.loading = data;
      this.cdr.detectChanges();
    });

    this.frameService.showLoaderAuth();
    await this.httpService.getRankings(this.httpClient).subscribe(
      (res: any) => {
        this.rankings = res;
        this.frameService.hideLoaderAuth();
      },
      error => {
        let errorText = error && error.error && error.error[0] ? error.error[0].value : 'Došlo je do greške prilikom dohvatanja igre dana';
        this.frameService.showToastPrime('Ups!', errorText, 'error', 4000);
        console.log(error);
        this.frameService.hideLoaderAuth();
      });
  }

}
