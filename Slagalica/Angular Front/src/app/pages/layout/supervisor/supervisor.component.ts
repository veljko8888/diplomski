import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FrameService } from 'app/@core/mock/frame.service';

@Component({
  selector: 'ngx-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.scss']
})
export class SupervisorComponent implements OnInit {

  constructor
    (
      private fb: FormBuilder,
      private frameService: FrameService,
      private httpService: HttpHandlerService
  ) { }

  formSubmitAttempt: boolean = false;
  showWordDialog: boolean = false;
  slagalicaForm: FormGroup = null;
  connForm: FormGroup = null;
  showConnDialog: boolean = false;
  formConnSubmitAttempt: boolean = false;
  assocForm: FormGroup = null;
  showAssocDialog: boolean = false;
  formAssocSubmitAttempt: boolean = false;


  ngOnInit() {
    this.initForms();
  }

  initForms() {
    this.slagalicaForm = this.fb.group({
      Rec: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    });

    this.assocForm = this.fb.group({
      Final: ['', [Validators.required, Validators.pattern('^[\.a-zA-Z0-9,!? ]*$')]],
      A1: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')]],
      A2: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')]],
      A3: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')]],
      A4: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')]],
      A: ['', [Validators.required, Validators.pattern('^[\.a-zA-Z0-9,!? ]*$')]],
      B1: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')]],
      B2: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')]],
      B3: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')]],
      B4: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')]],
      B: ['', [Validators.required, Validators.pattern('^[\.a-zA-Z0-9,!? ]*$')]],
      C1: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')]],
      C2: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')]],
      C3: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')]],
      C4: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')]],
      C: ['', [Validators.required, Validators.pattern('^[\.a-zA-Z0-9,!? ]*$')]],
      D1: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')]],
      D2: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')]],
      D3: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')]],
      D4: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')]],
      D: ['', [Validators.required, Validators.pattern('^[\.a-zA-Z0-9,!? ]*$')]],
    });

    this.connForm = this.fb.group({
      Description: ['', [Validators.required]],
      L1: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      R1: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      L2: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      R2: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      L3: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      R3: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      L4: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      R4: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      L5: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      R5: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      L6: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      R6: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      L7: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      R7: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      L8: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      R8: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      L9: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      R9: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      L10: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      R10: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    });
  }

  addWordUpload() {

  }

  addGameConnectionsUpload() {

  }

  addGameAssocUpload() {

  }

  showWordDialogBox() {
    this.showWordDialog = true;
  }

  showConnectionsGameDialogBox() {
    this.showConnDialog = true;
  }

  showAssocDialogBox() {
    this.showAssocDialog = true;
  }

  closeWordDialog(){
    this.slagalicaForm.reset();
    this.showWordDialog = false;
    this.formSubmitAttempt = false;
  }

  closeConnectionsGameDialog(){
    this.connForm.reset();
    this.showConnDialog = false;
    this.formConnSubmitAttempt = false;
  }

  closeAssocDialog(){
    this.assocForm.reset();
    this.showAssocDialog = false;
    this.formAssocSubmitAttempt = false;
  }

  async saveWord() {
    this.formSubmitAttempt = true;
    if (this.slagalicaForm.valid) {
      this.frameService.showLoaderAuth();
      let formValue = this.slagalicaForm.value;
      await this.httpService.addWord(formValue).subscribe(
        (res: any) => {
          //ON SUCCESS
          this.frameService.hideLoaderAuth();
          this.showWordDialog = false;
          this.slagalicaForm.reset();
          this.frameService.showToastPrime('Uspešno!', 'Uspešno ste dodali novu reč', 'success', 4000);
        },
        error => {
          let errorText = error && error.error && error.error[0] ? error?.error[0]?.Value : 'Došlo je do greške prilikom dodavanja reči';
          this.frameService.hideLoaderAuth();
          this.showWordDialog = false;
          this.slagalicaForm.reset();
          this.frameService.showToastPrime('Ups!', errorText, 'error', 4000);
          console.log(error);
        });
    }
  }

  async saveConnGame() {
    this.formConnSubmitAttempt = true;
    if (this.connForm.valid) {
      this.frameService.showLoader();
      let formValue = this.connForm.value;

      let requestData = this.packConnectionsData(formValue);

      await this.httpService.addConnectionGame(requestData).subscribe(
        (res: any) => {
          //ON SUCCESS
          this.frameService.hideLoader();
          this.showConnDialog = false;
          this.connForm.reset();
          this.frameService.showToastPrime('Uspešno!', 'Uspešno ste dodali novu igru spojnice', 'success', 4000);
        },
        error => {
          let errorText = error && error.error && error.error[0] ? error?.error[0]?.Value : 'Došlo je do greške prilikom dodavanja igre spojnica';
          this.frameService.hideLoader();
          this.showConnDialog = false;
          this.connForm.reset();
          this.frameService.showToastPrime('Ups!', errorText, 'error', 4000);
          console.log(error);
        });
    }
  }

  async saveAssoc() {
    this.formAssocSubmitAttempt = true;
    if (this.assocForm.valid) {
      this.frameService.showLoaderAuth();
      let formValue = this.assocForm.value;

      let assocRequest = this.packAssocRequest(formValue);

      await this.httpService.addAssocGame(assocRequest).subscribe(
        (res: any) => {
          //ON SUCCESS
          this.frameService.hideLoaderAuth();
          this.showAssocDialog = false;
          this.assocForm.reset();
          this.frameService.showToastPrime('Uspešno!', 'Uspešno ste dodali novu igru Asocijacije', 'success', 4000);
        },
        error => {
          let errorText = error && error.error && error.error[0] ? error?.error[0]?.Value : 'Došlo je do greške prilikom dodavanja igre Asocijacije';
          this.frameService.hideLoaderAuth();
          this.showAssocDialog = false;
          this.assocForm.reset();
          this.frameService.showToastPrime('Ups!', errorText, 'error', 4000);
          console.log(error);
        });
    }
  }

  packConnectionsData(formValue: any){
    let requestData = {
      Description: formValue.Description,
      Pairs: []
    }

    let pair = {
      Left: formValue.L1,
      Right: formValue.R1
    };
    requestData.Pairs.push(pair);

    pair = {
      Left: formValue.L2,
      Right: formValue.R2
    };
    requestData.Pairs.push(pair);

    pair = {
      Left: formValue.L3,
      Right: formValue.R3
    };
    requestData.Pairs.push(pair);

    pair = {
      Left: formValue.L4,
      Right: formValue.R4
    };
    requestData.Pairs.push(pair);

    pair = {
      Left: formValue.L5,
      Right: formValue.R5
    };
    requestData.Pairs.push(pair);

    pair = {
      Left: formValue.L6,
      Right: formValue.R6
    };
    requestData.Pairs.push(pair);

    pair = {
      Left: formValue.L7,
      Right: formValue.R7
    };
    requestData.Pairs.push(pair);

    pair = {
      Left: formValue.L8,
      Right: formValue.R8
    };
    requestData.Pairs.push(pair);

    pair = {
      Left: formValue.L9,
      Right: formValue.R9
    };
    requestData.Pairs.push(pair);

    pair = {
      Left: formValue.L10,
      Right: formValue.R10
    };
    requestData.Pairs.push(pair);

    return requestData;
  }

  packAssocRequest(assocFormValue: any){
    assocFormValue.A = assocFormValue.A.replace(/\s\s+/g, ' ').replace(/,+/g,',').trim();
    assocFormValue.B = assocFormValue.B.replace(/\s\s+/g, ' ').replace(/,+/g,',').trim();
    assocFormValue.C = assocFormValue.C.replace(/\s\s+/g, ' ').replace(/,+/g,',').trim();
    assocFormValue.D = assocFormValue.D.replace(/\s\s+/g, ' ').replace(/,+/g,',').trim();
    assocFormValue.A1 = assocFormValue.A1.replace(/\s\s+/g, ' ').trim();
    assocFormValue.A2 = assocFormValue.A2.replace(/\s\s+/g, ' ').trim();
    assocFormValue.A3 = assocFormValue.A3.replace(/\s\s+/g, ' ').trim();
    assocFormValue.A4 = assocFormValue.A4.replace(/\s\s+/g, ' ').trim();
    assocFormValue.B1 = assocFormValue.B1.replace(/\s\s+/g, ' ').trim();
    assocFormValue.B2 = assocFormValue.B2.replace(/\s\s+/g, ' ').trim();
    assocFormValue.B3 = assocFormValue.B3.replace(/\s\s+/g, ' ').trim();
    assocFormValue.B4 = assocFormValue.B4.replace(/\s\s+/g, ' ').trim();
    assocFormValue.C1 = assocFormValue.C1.replace(/\s\s+/g, ' ').trim();
    assocFormValue.C2 = assocFormValue.C2.replace(/\s\s+/g, ' ').trim();
    assocFormValue.C3 = assocFormValue.C3.replace(/\s\s+/g, ' ').trim();
    assocFormValue.C4 = assocFormValue.C4.replace(/\s\s+/g, ' ').trim();
    assocFormValue.D1 = assocFormValue.D1.replace(/\s\s+/g, ' ').trim();
    assocFormValue.D2 = assocFormValue.D2.replace(/\s\s+/g, ' ').trim();
    assocFormValue.D3 = assocFormValue.D3.replace(/\s\s+/g, ' ').trim();
    assocFormValue.D4 = assocFormValue.D4.replace(/\s\s+/g, ' ').trim();
    assocFormValue.Final = assocFormValue.Final.replace(/\s\s+/g, ' ').replace(/,+/g,',').trim();

    return assocFormValue;
  }
}
