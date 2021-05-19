import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FormValidationService } from 'app/@core/mock/form-validation.service';
import { FrameService } from 'app/@core/mock/frame.service';
import { UserService } from 'app/@core/mock/users.service';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  constructor(
    private httpService: HttpHandlerService,
    private frameService: FrameService,
    public formValidationService: FormValidationService,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  selectedUsers: any[];
  users = [];
  cols = [];
  checked: boolean = false;

  async ngOnInit() {
    this.cols = [
      { field: 'ime', header: 'Ime', fieldType: 'text' },
      { field: 'prezime', header: 'Prezime', fieldType: 'text' },
      { field: 'email', header: 'Email', fieldType: 'text' },
      { field: 'zanimanje', header: 'Zanimanje', fieldType: 'text' },
      { field: 'korisnickoIme', header: 'Korisnicko Ime', fieldType: 'text' },
      { field: 'pol', header: 'Pol', fieldType: 'text' },
      { field: 'datumRodjenja', header: 'Datum Rodjenja', fieldType: 'date' },
      { field: 'tipKorisnika', header: 'Tip Korisnika', fieldType: 'text' },
      { field: 'nalogAktiviran', header: 'Nalog Aktiviran', fieldType: 'text' },
    ];

    this.frameService.showLoader();
    await this.httpService.getAllUsers().subscribe(
      (res: any) => {
        this.users = res;
        console.log(res)
        this.frameService.hideLoader();
      },
      error => {
        this.frameService.hideLoader();
        this.frameService.showToastPrime('Ups!', 'Došlo je do greške.', 'error', 4000);
        console.log(error);
      });
  }

  async activateDeactivate(korisnik: any){
    this.frameService.showLoader();
    await this.httpService.activateDeactivateUser(korisnik).subscribe(
      (res: any) => {
        this.users = res;
        //console.log(res)
        this.frameService.hideLoader();
        this.frameService.showToastPrime('Uspešno!', 'Uspešno ste promenili status korisničkog naloga.', 'success', 4000);
      },
      error => {
        this.frameService.hideLoader();
        this.frameService.showToastPrime('Ups!', 'Došlo je do greške.', 'error', 4000);
        console.log(error);
      });
  }

  // if (!this.userService.getCurrentUser()) {
  //   this.frameService.showLoader();

  //   await this.httpService.getUserProfile().subscribe(
  //     (res: any) => {
  //       this.userService.saveLoggedInUser(res);
  //       this.frameService.showToastPrime('Zdravo!', 'Uspešna prijava na sistem, dobrodošli.', 'success', 4000);
  //       this.frameService.hideLoader();
  //     },
  //     error => {
  //       this.frameService.hideLoader();
  //       this.frameService.showToastPrime('Ups!', 'Došlo je do greške prilikom prijave na sistem.', 'error', 4000);
  //       console.log(error);
  //     });
  // }

}
