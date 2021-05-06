import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FrameService } from 'app/@core/mock/frame.service';
import { ProjectService } from 'app/@core/mock/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidationService } from 'app/@core/mock/form-validation.service';
import { Router } from '@angular/router';
import { AuthService } from 'app/authentication/auth.service';
import { UserService } from 'app/@core/mock/users.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  createProjectDialogVisible: boolean = false;
  jurisdictions = [];
  projectTypes = [];
  designations = [];
  workTypes = [];
  specificUses = [];

  projectSettings = null;
  selectedJurisdictionID = null;
  selectedProjectTypeID = null;
  selectedDesignationID = null;
  selectedSpecificUseID = null;

  projectForm: FormGroup = null;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Profile', data: { id: 'userDetails' } }, { title: 'Log out', data: { id: 'logout' } }];

  searchText: string;
  projectsResults: any[];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    //private userService: UserData,
    public userService: UserService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private httpService: HttpHandlerService,
    private frameService: FrameService,
    private projectService: ProjectService,
    private fb: FormBuilder,
    public formValidationService: FormValidationService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2) {
  }

  ngOnInit() {
    this.initForm();
    this.userService.currentUser$.subscribe((data) => {
      this.user = data;
      this.cdr.detectChanges();
    });

    this.currentTheme = this.themeService.currentTheme;

    // this.userService.getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => this.user = users.nick);

    this.user = this.userService.getCurrentUser();

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.menuService.onItemClick()
      // .pipe(
      //   filter(({ tag }) => tag === 'my-context-menu'),
      // )
      .subscribe((event) => {
        if (event.item?.data?.id === 'logout') {
          //localStorage.removeItem('token');
          //this.authService.logoutUserFromCognito();
          //window.location.assign(environment.logout);
          //this.authService.logoutUserFromCognito();
          this.router.navigate(['/']);
          //this.authService.signOutSSO();
        }
        else if (event.item?.data?.id === 'userDetails') {
          this.router.navigate(['/pages/layout/userDetails']);
        }
      });
  }

  ngAfterViewInit(): void {
    this.renderer.listen(document.querySelector('nb-menu'), 'click', (event) => {
      if (!!event && event.target && event.target.innerText == 'Create') {
        this.showCreateProjectDialog();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchProducts(event) {
    this.httpService.quickSearchProjects(event.query).subscribe(
      (res: any) => {
        this.projectsResults = res;
      })
  }

  selectProject(project: any) {
    this.router.navigate(['/pages/layout/projectinfo', project.PermitID]);
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  showCreateProjectDialog() {
    if (this.projectService.globalSaveVisible) {
      this.projectService.globalSaveVisible = false;
      this.projectService.globalSaveMarked = true;
    }
    this.frameService.showLoader();
    this.httpService.getJurisdictions().subscribe(
      (res: any) => {
        this.jurisdictions = res;
        this.frameService.hideLoader();
      },
      error => {
        this.frameService.hideLoader();
        this.frameService.showToastPrime('Error!', 'An error ocurred while fetching the Jurisdictions.', 'error', 4000);
      }
    );
    this.createProjectDialogVisible = true;
  }

  closeDialog() {
    this.projectForm.reset();
    this.createProjectDialogVisible = false;
    this.formValidationService.formSubmitAttempt = false;
    this.projectSettings = null;
    this.workTypes = null;
    this.specificUses = null;
    this.designations = null;
    this.jurisdictions = null;
    this.projectTypes = null;
    this.projectForm.get('ProjectType').disable({ onlySelf: true, emitEvent: false });
    if (this.projectService.globalSaveMarked) {
      this.projectService.globalSaveVisible = true;
      this.projectService.globalSaveMarked = false;
    }
  }

  initForm() {
    this.projectForm = this.fb.group({
      Jurisdiction: ['', Validators.required],
      ProjectType: [{ value: '', disabled: true }, Validators.required],
      ProjectNumber: [''],
      Designation: [''],
      WorkType: [''],
      SpecificUse: [''],
      ProjectDescription: ['']
    });

    this.projectForm.get('Jurisdiction').valueChanges.subscribe(val => {
      if (val) {
        this.frameService.showLoader();
        this.httpService.getProjectTypes(val).subscribe(
          (res: any) => {
            this.projectTypes = res;
            this.selectedJurisdictionID = val;
            this.projectForm.get('ProjectType').enable({ onlySelf: true, emitEvent: false });
            this.projectForm.get('ProjectType').setValue(null);

            this.projectForm.get('Designation').setValue(null);
            this.projectForm.get('WorkType').setValue(null);
            this.projectForm.get('SpecificUse').setValue(null);
            this.projectSettings = null;
            this.designations = null;
            this.workTypes = null;
            this.specificUses = null;
            this.frameService.hideLoader();
          },
          error => {
            this.frameService.hideLoader();
            this.frameService.showToastPrime('Error!', 'An error ocurred while fetching the Project Types.', 'error', 4000);
          }
        );
      }
    });

    this.projectForm.get('ProjectType').valueChanges.subscribe(val => {
      if (val) {
        this.frameService.showLoader();
        this.httpService.getProjectSettings(this.selectedJurisdictionID, val).subscribe(
          (res: any) => {
            this.projectSettings = res;
            this.selectedProjectTypeID = val;
            this.resolveAdditionalFields(res);
            this.frameService.hideLoader();
          },
          error => {
            this.frameService.hideLoader();
            this.frameService.showToastPrime('Error!', 'An error ocurred while fetching the Project Settings.', 'error', 4000);
          }
        );
      }
    });

    this.projectForm.get('Designation').valueChanges.subscribe(val => {
      this.selectedDesignationID = val;
      if (val && this.projectSettings.DesignationFiltersSpecificUse) {
        this.specificUses = this.projectSettings.SpecificUses.filter(x => x.DesignationTypeID == val);
        if (this.projectForm.get('SpecificUse').disabled) {
          this.projectForm.get('SpecificUse').enable({ onlySelf: true, emitEvent: false });
        }
      }
      if (val && this.projectSettings.DesignationFiltersWorktype) {
        this.workTypes = this.projectSettings.WorkTypes.filter(x => x.DesignationTypeID == val);
        if (this.projectSettings.SpecificUseFiltersWorkType && this.selectedSpecificUseID) {
          this.workTypes = this.workTypes.filter(x => x.SpecificUseID == this.selectedSpecificUseID);
        }
        if (this.projectForm.get('WorkType').disabled) {
          this.projectForm.get('WorkType').enable({ onlySelf: true, emitEvent: false });
        }
      }

      if (this.workTypes.length == 0) {
        this.projectForm.get('WorkType').clearValidators();
        this.projectForm.get('WorkType').updateValueAndValidity();
      }
    });

    this.projectForm.get('SpecificUse').valueChanges.subscribe(val => {
      this.selectedSpecificUseID = val;
      if (val && this.projectSettings.SpecificUseFiltersWorkType) {
        this.workTypes = this.projectSettings.WorkTypes.filter(x => x.SpecificUseID == val);
        if (this.projectSettings.DesignationFiltersWorktype && this.selectedDesignationID) {
          this.workTypes = this.workTypes.filter(x => x.DesignationTypeID == this.selectedDesignationID);
        }
        if (this.projectForm.get('WorkType').disabled) {
          this.projectForm.get('WorkType').enable({ onlySelf: true, emitEvent: false });
        }
      }
      if (this.workTypes.length == 0) {
        this.projectForm.get('WorkType').clearValidators();
        this.projectForm.get('WorkType').updateValueAndValidity();
      }
    });
  }

  resolveAdditionalFields(projectSettings: any) {
    this.designations = projectSettings.Designations;
    this.workTypes = projectSettings.WorkTypes;
    this.specificUses = projectSettings.SpecificUses;
    this.projectForm.get('Designation').setValue(null);
    this.projectForm.get('WorkType').setValue(null);
    this.projectForm.get('SpecificUse').setValue(null);
    this.projectForm.get('ProjectNumber').setValue(null);

    if (projectSettings.IsShowProjectNumberField) {
      this.projectForm.get('ProjectNumber').setValidators([Validators.required]);
    }
    else {
      this.projectForm.get('ProjectNumber').clearValidators();
    }
    if (this.designations && this.designations.length) {
      this.projectForm.get('Designation').setValidators([Validators.required]);
    }
    else {
      this.projectForm.get('Designation').clearValidators();
    }
    if (this.workTypes && this.workTypes.length) {
      this.projectForm.get('WorkType').setValidators([Validators.required]);
    }
    else {
      this.projectForm.get('WorkType').clearValidators();
    }
    if (this.specificUses && this.specificUses.length) {
      this.projectForm.get('SpecificUse').setValidators([Validators.required]);
    }
    else {
      this.projectForm.get('SpecificUse').clearValidators();
    }

    this.projectForm.get('Designation').updateValueAndValidity();
    this.projectForm.get('WorkType').updateValueAndValidity();
    this.projectForm.get('SpecificUse').updateValueAndValidity();
    this.projectForm.get('ProjectNumber').updateValueAndValidity();

    if (projectSettings.DesignationFiltersSpecificUse) {
      this.projectForm.get('SpecificUse').disable({ onlySelf: true, emitEvent: false });
    }
    if (!projectSettings.DesignationFiltersSpecificUse && this.projectForm.get('SpecificUse').disabled) {
      this.projectForm.get('SpecificUse').enable({ onlySelf: true, emitEvent: false });
    }
    if (projectSettings.DesignationFiltersWorktype || projectSettings.SpecificUseFiltersWorkType) {
      this.projectForm.get('WorkType').disable({ onlySelf: true, emitEvent: false });
    }
    if (!projectSettings.DesignationFiltersWorktype && !projectSettings.SpecificUseFiltersWorkType && this.projectForm.get('WorkType').disabled) {
      this.projectForm.get('WorkType').enable({ onlySelf: true, emitEvent: false });
    }
  }

  saveProject() {
    this.formValidationService.formSubmitAttempt = true;
    if (this.projectForm.valid) {
      let projectObj = this.projectForm.value;
      let saveProjectModel = {
        JurisdictionID: +projectObj.Jurisdiction,
        ProjectTypeID: +projectObj.ProjectType,
        WorkTypeID: projectObj.WorkType ? +projectObj.WorkType : -1,
        SpecificUseID: projectObj.SpecificUse ? +projectObj.SpecificUse : -1,
        UserID: this.userService.getCurrentUser().UserID
      }

      this.addAdditionalFieldsIfNeeded(saveProjectModel, projectObj);

      //SUBMIT TO BACKEND AND REDIRECT ON THE PROJECTINFO PAGE
      this.httpService.saveProject(saveProjectModel).subscribe(
        (res: any) => {
          this.closeDialog();
          this.frameService.showToastPrime('Success!', 'Successfully Saved Project', 'success', 3000);
          setTimeout(() => { }, 3);
          this.router.navigate(['/pages/layout/projectinfo', res]);
        },
        error => {
          this.frameService.hideLoader();
          this.frameService.showToastPrime('Error!', 'An error ocurred while saving the project.', 'error', 4000);
        }
      );
    }
  }

  addAdditionalFieldsIfNeeded(saveProjectModel: any, projectObj: any) {
    if (projectObj.Designation) {
      saveProjectModel.DesignationType = this.designations.find(x => x.DesignationTypeID == +projectObj.Designation).Description;
    }
    if (projectObj.ProjectDescription) {
      saveProjectModel.ProjectDescription = projectObj.ProjectDescription;
    }
    if (projectObj.ProjectNumber) {
      saveProjectModel.ProjectNumber = projectObj.ProjectNumber;
    }
  }
}
