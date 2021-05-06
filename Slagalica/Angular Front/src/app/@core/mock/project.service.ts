import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  globalSaveVisible: boolean = false;
  globalSaveMarked: boolean = false;

  constructor() { }

}
