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

  userMenu = [{ title: 'Profil Korisnika', data: { id: 'userDetails' } }, { title: 'Odjavi me', data: { id: 'logout' } }];

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
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2) {
  }

  ngOnInit() {
    this.userService.currentUser$.subscribe((data) => {
      this.user = data;
      if(data){
        this.user.name = data.ime + ' ' + data.prezime;
      }
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
      .subscribe((event) => {
        if (event.item?.data?.id === 'logout') {
          localStorage.removeItem('token');
          this.userService.saveLoggedInUser(null);
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
        //this.showCreateProjectDialog();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
}
