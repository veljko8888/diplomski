import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpHandlerService } from './http-handler.service';

const SERVICES = [
  HttpHandlerService
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})

export class HttpModule {
  static forRoot(): ModuleWithProviders<HttpModule> {
    return {
      ngModule: HttpModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
