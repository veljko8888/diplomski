import { Component, OnInit } from '@angular/core';
import { FrameService } from 'app/@core/mock/frame.service';
import { ProjectService } from 'app/@core/mock/project.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  templateUrl: './one-column.layout.html',

  //[nbSpinner]="loading" nbSpinnerStatus="danger"
})
export class OneColumnLayoutComponent implements OnInit {

  constructor(
    private frameService: FrameService,
    private messageService: MessageService
  ) { }

  loading: boolean = false;
  toastObj: any;

  ngOnInit() {
    this.frameService.loader$.subscribe((data) => {
      this.loading = data;
    });

    this.frameService.toast$.subscribe((toast) => {
      if (toast) {
        if (toast.destroyAll) {
          this.messageService.clear();
        }
        else {
          this.toastObj = toast;
          this.messageService.clear();
          if (toast.sticky) {
            this.messageService.add({ key: 'toast', closable: toast.closable, severity: toast.severity, summary: toast.summary, detail: toast.message, sticky: toast.sticky });
          }
          else {
            this.messageService.add({ key: 'toast', closable: false, life: toast.duration, severity: toast.severity, summary: toast.summary, detail: toast.message });
          }
        }
      }
    });
  }

}
