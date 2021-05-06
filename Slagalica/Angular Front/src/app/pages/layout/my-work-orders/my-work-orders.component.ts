import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FrameService } from 'app/@core/mock/frame.service';
import { debug } from 'console';

@Component({
  selector: 'ngx-my-work-orders',
  templateUrl: './my-work-orders.component.html',
  styleUrls: ['./my-work-orders.component.scss']
})
export class MyWorkOrdersComponent implements OnInit {

  workOrders: any[];
  cols: any[];
  allCols: any[];
  selectedWorkOrders: any[];
  dateFrom: Date = new Date();
  dateTo: Date = new Date();
  selectedCols: any[] =
    [
      'WorkOrderID',
      'InspectionType',
      'ProjectNumber',
      'ProjectDescription',
      'ProjectAddress',
      'Requestor',
      'Notes',
      'ScheduledDateTime'
    ];

  constructor(
    private httpService: HttpHandlerService,
    private frameService: FrameService,
    private router: Router
  ) { }

  ngOnInit() {
    this.allCols = [
      { field: 'WorkOrderID', header: 'W.O. #', fieldType: 'text', link: true, mandatory: true },
      { field: 'InspectionType', header: 'Ins. Type', fieldType: 'text', mandatory: true },
      { field: 'ProjectNumber', header: 'Project #', fieldType: 'text', mandatory: true },
      { field: 'SecondaryProjectNumber', header: 'Secondary Number', fieldType: 'text' },
      { field: 'ProjectName', header: 'Name', fieldType: 'text' },
      { field: 'ProjectDescription', header: 'Desc.', fieldType: 'text' },
      { field: 'ParcelNumber', header: 'Parcel #', fieldType: 'text' },
      { field: 'ProjectAddress', header: 'Address', fieldType: 'text' },
      { field: 'ProjectLot', header: 'Lot', fieldType: 'text' },
      { field: 'ProjectSubDivision', header: 'Subdivision', fieldType: 'text' },
      { field: 'ProjectIssuedDate', header: 'Issued Date', fieldType: 'date' },
      { field: 'WorkType', header: 'Work Type', fieldType: 'text' },
      { field: 'District', header: 'District', fieldType: 'text' },
      { field: 'Requestor', header: 'Requestor', fieldType: 'text' },
      { field: 'ScheduledDateTime', header: 'Sched', fieldType: 'date', mandatory: true },
      { field: 'WorkOrderCreateDate', header: 'Created', fieldType: 'date' },
      { field: 'Notes', header: 'Notes', fieldType: 'text' },
    ];

    this.cols = [
      { field: 'WorkOrderID', header: 'W.O. #', fieldType: 'text', link: true, mandatory: true },
      { field: 'InspectionType', header: 'Ins. Type', fieldType: 'text', mandatory: true },
      { field: 'ProjectNumber', header: 'Project #', fieldType: 'text', mandatory: true },
      { field: 'ProjectDescription', header: 'Desc.', fieldType: 'text' },
      { field: 'ProjectAddress', header: 'Address', fieldType: 'text' },
      { field: 'Requestor', header: 'Requestor', fieldType: 'text' },
      { field: 'ScheduledDateTime', header: 'Sched', fieldType: 'date', mandatory: true },
      { field: 'Notes', header: 'Notes', fieldType: 'text' },
    ];

    this.filterWorkOrders();
  }

  navigateToWorkOrderDetail(workOrder: any) {
    this.router.navigate(['/pages/layout/myworkorders', workOrder.WorkOrderID]);
  }

  navigateToProject(workOrder: any) {
    this.router.navigate(['/pages/layout/projectinfo', workOrder.ProjectID]);
  }

  colsChanged() {
    this.cols = this.allCols.filter(x => this.selectedCols.includes(x.field));
  }

  async filterWorkOrders() {
    this.frameService.showLoader();
    let dateFrom = this.formatDate(this.dateFrom);
    let dateTo = this.formatDate(this.dateTo);
    await this.httpService.searchWorkDetails(dateFrom, dateTo).subscribe(
      (res: any) => {
        this.workOrders = res;
        this.frameService.hideLoader();
      },
      error => {
        this.frameService.hideLoader();
        this.frameService.showToastPrime('Error!', 'An error ocurred while fetching work orders.', 'error', 4000);
      });
  }

  formatDate(date: any) {
    let dateString = '';
    if (date != null) {
      let dd = date.getDate();
      let mm = date.getMonth() + 1;
      const yyyy = date.getFullYear();
      if (dd < 10) {
        dd = `0${dd}`;
      }
      if (mm < 10) {
        mm = `0${mm}`;
      }
      dateString = `${yyyy}-${mm}-${dd}`;
    }

    return dateString;
  }


  // "WorkOrderID": 13402287,
  //       "ProjectID": 4629419,
  //       "ProjectNumber": "2020-32777",
  //       "ProjectName": "SFR Remove existing electrical panel and replace with updated/new electrical panel",
  //       "InspectionTypeID": 1097,
  //       "InspectionType": "Electrical Final",
  //       "WorkType": "Electrical",
  //       "DesignationType": "Residential",
  //       "WorkOrderCreateDate": "2020-08-31T20:54:09.76",
  //       "ProjectDescription": "SFR Remove existing electrical panel and replace with updated/new electrical panel",
  //       "Notes": "",
  //       "ProjectAddress": "100 W LAUREL LN",
  //       "ProjectCity": "San Marcos",
  //       "ProjectState": "TX",
  //       "ProjectZip": "78666",
  //       "ProjectAddressDescription": "",
  //       "ProjectLot": "",
  //       "ProjectSubDivision": "",
  //       "ProjectIssuedDate": "2020-07-15T00:00:00",
  //       "District": "- Not Assigned -",
  //       "Priority": null,
  //       "SecondaryProjectNumber": "",
  //       "ParcelNumber": "R43395",
  //       "ScheduledDateTime": "2020-10-01T00:00:00",
  //       "Requestor": "",
  //       "RequestorPhoneNumber": ""
}
