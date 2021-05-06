import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-search-projects',
  templateUrl: './search-projects.component.html',
  styleUrls: ['./search-projects.component.scss']
})
export class SearchProjectsComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  projects = [
    { id: 4720308, projectNumber: '2020-2250', projectName: '', status: 'Approved' },
    { id: 4712269, projectNumber: '2020-2245', projectName: '', status: 'Approved' },
  ];

  selectedProject = null;

  ngOnInit() {
  }


  openProject(project: any){
    this.router.navigate(['/pages/layout/projectinfo', project.id]);
  }

}
