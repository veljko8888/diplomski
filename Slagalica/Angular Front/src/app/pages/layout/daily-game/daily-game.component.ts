import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FrameService } from 'app/@core/mock/frame.service';

@Component({
  selector: 'ngx-daily-game',
  templateUrl: './daily-game.component.html',
  styleUrls: ['./daily-game.component.scss']
})
export class DailyGameComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private httpService: HttpHandlerService,
    private frameService: FrameService
  ) { }

  dailyGameForm: FormGroup = null;
  formSubmitAttempt: boolean = false;
  showDailyGame: boolean = false;
  dailyGameObj: any;
  connections: any[];
  selectedConnection: any;
  associations: any[];
  selectedAssociation: any;
  dailyGamesMainObject: any;

  async ngOnInit() {
    this.initForm();
    await this.getData();
  }

  initForm() {
    this.dailyGameForm = this.fb.group({
      DailyGameDate: [new Date()],
      Description: new FormControl({ value: '', disabled: true }),
      L1: new FormControl({ value: '', disabled: true }),
      R1: new FormControl({ value: '', disabled: true }),
      L2: new FormControl({ value: '', disabled: true }),
      R2: new FormControl({ value: '', disabled: true }),
      L3: new FormControl({ value: '', disabled: true }),
      R3: new FormControl({ value: '', disabled: true }),
      L4: new FormControl({ value: '', disabled: true }),
      R4: new FormControl({ value: '', disabled: true }),
      L5: new FormControl({ value: '', disabled: true }),
      R5: new FormControl({ value: '', disabled: true }),
      L6: new FormControl({ value: '', disabled: true }),
      R6: new FormControl({ value: '', disabled: true }),
      L7: new FormControl({ value: '', disabled: true }),
      R7: new FormControl({ value: '', disabled: true }),
      L8: new FormControl({ value: '', disabled: true }),
      R8: new FormControl({ value: '', disabled: true }),
      L9: new FormControl({ value: '', disabled: true }),
      R9: new FormControl({ value: '', disabled: true }),
      L10: new FormControl({ value: '', disabled: true }),
      R10: new FormControl({ value: '', disabled: true }),
      Final: new FormControl({ value: '', disabled: true }),
      A1: new FormControl({ value: '', disabled: true }),
      A2: new FormControl({ value: '', disabled: true }),
      A3: new FormControl({ value: '', disabled: true }),
      A4: new FormControl({ value: '', disabled: true }),
      A: new FormControl({ value: '', disabled: true }),
      B1: new FormControl({ value: '', disabled: true }),
      B2: new FormControl({ value: '', disabled: true }),
      B3: new FormControl({ value: '', disabled: true }),
      B4: new FormControl({ value: '', disabled: true }),
      B: new FormControl({ value: '', disabled: true }),
      C1: new FormControl({ value: '', disabled: true }),
      C2: new FormControl({ value: '', disabled: true }),
      C3: new FormControl({ value: '', disabled: true }),
      C4: new FormControl({ value: '', disabled: true }),
      C: new FormControl({ value: '', disabled: true }),
      D1: new FormControl({ value: '', disabled: true }),
      D2: new FormControl({ value: '', disabled: true }),
      D3: new FormControl({ value: '', disabled: true }),
      D4: new FormControl({ value: '', disabled: true }),
      D: new FormControl({ value: '', disabled: true }),
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

  async saveSelectedGames() {
    console.log(this.selectedAssociation);
    console.log(this.selectedConnection);
    if (this.selectedAssociation && this.selectedConnection && this.dailyGameForm.value?.DailyGameDate) {
      this.frameService.showLoader();
      let dailyGame = {
        Id: this.dailyGamesMainObject.id,
        DailyGameDate: this.formatDate(this.dailyGameForm.value.DailyGameDate),
        ConnectionId: this.selectedConnection.id,
        AssociationId: this.selectedAssociation.id
      };
      await this.httpService.addDailyGame(dailyGame).subscribe(
        (res: any) => {
          //ON SUCCESS
          this.dailyGamesMainObject = res;
          if (res.connection && res.association) {
            this.showDailyGame = true;
          }
          this.populateForm(res);
          this.selectedConnection = null;
          this.selectedAssociation = null;
          this.frameService.showToastPrime('Uspešno!', 'Uspešno ste dodali/izmenili nove igre dana', 'success', 4000);
          this.frameService.hideLoader();
        },
        error => {
          let errorText = error && error.error && error.error[0] ? error.error[0].value : 'Došlo je do greške prilikom dodavanja igara dana';
          this.frameService.hideLoader();
          this.frameService.showToastPrime('Ups!', errorText, 'error', 4000);
          console.log(error);
        });
    }
    else {
      this.frameService.showToastPrime('Ups!', 'Niste odabrali obe igre dana', 'error', 4000);
    }
  }

  changeSelectedGames() {
    this.showDailyGame = !this.showDailyGame;
  }

  populateForm(dailyGames: any) {
    this.dailyGameForm.get('A1').setValue(dailyGames.association.a1);
    this.dailyGameForm.get('A2').setValue(dailyGames.association.a2);
    this.dailyGameForm.get('A3').setValue(dailyGames.association.a3);
    this.dailyGameForm.get('A4').setValue(dailyGames.association.a4);
    this.dailyGameForm.get('A').setValue(dailyGames.association.a);
    this.dailyGameForm.get('B1').setValue(dailyGames.association.b1);
    this.dailyGameForm.get('B2').setValue(dailyGames.association.b2);
    this.dailyGameForm.get('B3').setValue(dailyGames.association.b3);
    this.dailyGameForm.get('B4').setValue(dailyGames.association.b4);
    this.dailyGameForm.get('B').setValue(dailyGames.association.b);
    this.dailyGameForm.get('C1').setValue(dailyGames.association.c1);
    this.dailyGameForm.get('C2').setValue(dailyGames.association.c2);
    this.dailyGameForm.get('C3').setValue(dailyGames.association.c3);
    this.dailyGameForm.get('C4').setValue(dailyGames.association.c4);
    this.dailyGameForm.get('C').setValue(dailyGames.association.c);
    this.dailyGameForm.get('D1').setValue(dailyGames.association.d1);
    this.dailyGameForm.get('D2').setValue(dailyGames.association.d2);
    this.dailyGameForm.get('D3').setValue(dailyGames.association.d3);
    this.dailyGameForm.get('D4').setValue(dailyGames.association.d4);
    this.dailyGameForm.get('D').setValue(dailyGames.association.d);
    this.dailyGameForm.get('Final').setValue(dailyGames.association.final);
    this.dailyGameForm.get('Description').setValue(dailyGames.connection.description);
    this.dailyGameForm.get('L1').setValue(dailyGames.connection.pairs[0].left);
    this.dailyGameForm.get('R1').setValue(dailyGames.connection.pairs[0].right);
    this.dailyGameForm.get('L2').setValue(dailyGames.connection.pairs[1].left);
    this.dailyGameForm.get('R2').setValue(dailyGames.connection.pairs[1].right);
    this.dailyGameForm.get('L3').setValue(dailyGames.connection.pairs[2].left);
    this.dailyGameForm.get('R3').setValue(dailyGames.connection.pairs[2].right);
    this.dailyGameForm.get('L4').setValue(dailyGames.connection.pairs[3].left);
    this.dailyGameForm.get('R4').setValue(dailyGames.connection.pairs[3].right);
    this.dailyGameForm.get('L5').setValue(dailyGames.connection.pairs[4].left);
    this.dailyGameForm.get('R5').setValue(dailyGames.connection.pairs[4].right);
    this.dailyGameForm.get('L6').setValue(dailyGames.connection.pairs[5].left);
    this.dailyGameForm.get('R6').setValue(dailyGames.connection.pairs[5].right);
    this.dailyGameForm.get('L7').setValue(dailyGames.connection.pairs[6].left);
    this.dailyGameForm.get('R7').setValue(dailyGames.connection.pairs[6].right);
    this.dailyGameForm.get('L8').setValue(dailyGames.connection.pairs[7].left);
    this.dailyGameForm.get('R8').setValue(dailyGames.connection.pairs[7].right);
    this.dailyGameForm.get('L9').setValue(dailyGames.connection.pairs[8].left);
    this.dailyGameForm.get('R9').setValue(dailyGames.connection.pairs[8].right);
    this.dailyGameForm.get('L10').setValue(dailyGames.connection.pairs[9].left);
    this.dailyGameForm.get('R10').setValue(dailyGames.connection.pairs[9].right);
  }

  async getData() {
    this.formSubmitAttempt = true;
    if (this.dailyGameForm.valid) {
      this.frameService.showLoader();
      let dailyGameDate = {
        DailyGameDate: this.formatDate(this.dailyGameForm.value?.DailyGameDate)
      };
      await this.httpService.getDailyGamesForDate(dailyGameDate).subscribe(
        (res: any) => {
          //ON SUCCESS
          this.dailyGamesMainObject = res;
          if (res.connection && res.association) {
            this.populateForm(res);
            this.showDailyGame = true;
          }
          else {
            this.showDailyGame = false;
          }
          this.connections = res.connections;
          this.associations = res.associations;
          this.frameService.hideLoader();
        },
        error => {
          let errorText = error && error.error && error.error[0] ? error.error[0].value : 'Došlo je do greške prilikom dohvatanja igre dana';
          this.frameService.hideLoader();
          this.frameService.showToastPrime('Ups!', errorText, 'error', 4000);
          console.log(error);
        });
    }
  }

}
