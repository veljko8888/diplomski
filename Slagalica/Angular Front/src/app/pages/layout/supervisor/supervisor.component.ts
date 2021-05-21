import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FrameService } from 'app/@core/mock/frame.service';
import { MessageService } from 'primeng/api';

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
      private httpService: HttpHandlerService,
      private messageService: MessageService
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
  fileToUpload: File = null;
  readText: any;
  textCalc: string = null;

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

  uploadFile(files: FileList) {
    this.fileToUpload = files.item(0);

    if (this.fileToUpload) {
      this.frameService.showLoader()
      let reader = new FileReader();
      reader.onload = async () => {
        try {
          this.textCalc = reader.result.toString();
          let wordsObject = JSON.parse(this.textCalc);
          let wordsRequest = [];
          wordsObject.Words.forEach(word => {
            let wordObj = {
              Rec: word.Term
            }
            wordsRequest.push(wordObj);
          });

          await this.httpService.addWordsUpload(wordsRequest).subscribe(
            (res: any) => {
              //ON SUCCESS
              this.frameService.hideLoader();
              this.frameService.showToastPrime('Uspešno!', 'Uspešno ste dodali nove reči', 'success', 4000);
            },
            error => {
              let errorText = error && error.error && error.error[0] ? error.error[0].value : 'Došlo je do greške prilikom dodavanja reči';
              this.frameService.hideLoader();
              this.frameService.showToastPrime('Ups!', errorText, 'error', 4000);
              console.log(error);
            });

          console.log(this.textCalc);
          this.frameService.hideLoader();
        }
        catch (error) {
          this.frameService.hideLoader();
          this.frameService.showToastPrime('Ups!', 'Greška prilikom čitanja dokumenta. Moguća greška u strukturi vašeg dokumenta. Molimo vas da proverite.', 'error', 4000);
        }
      }
      reader.readAsText(this.fileToUpload);
    }
  }

  uploadFileConn(files: FileList) {
    this.fileToUpload = files.item(0);

    if (this.fileToUpload) {
      this.frameService.showLoader()
      let reader = new FileReader();
      reader.onload = async () => {
        try {
          this.textCalc = reader.result.toString();
          let connObjects = JSON.parse(this.textCalc);
          let connsRequest = [];
          connObjects.Games.forEach(game => {
            let connObj = {
              Description: game.Description,
              Pairs: []
            }

            game.Pairs.forEach(pair => {
              let pairObj = {
                Left: pair.left,
                Right: pair.right
              }

              connObj.Pairs.push(pairObj);
            });

            connsRequest.push(connObj);
          });

          await this.httpService.addConnsUpload(connsRequest).subscribe(
            (res: any) => {
              //ON SUCCESS
              this.frameService.hideLoader();
              this.frameService.showToastPrime('Uspešno!', 'Uspešno ste dodali nove igre spojnice', 'success', 4000);
            },
            error => {
              let errorText = error && error.error && error.error[0] ? error.error[0].value : 'Došlo je do greške prilikom dodavanja igara spojnice';
              this.frameService.hideLoader();
              this.frameService.showToastPrime('Ups!', errorText, 'error', 4000);
              console.log(error);
            });

          console.log(this.textCalc);
          this.frameService.hideLoader();
        }
        catch (error) {
          this.frameService.hideLoader();
          this.frameService.showToastPrime('Ups!', 'Greška prilikom čitanja dokumenta. Moguća greška u strukturi vašeg dokumenta. Molimo vas da proverite.', 'error', 4000);
        }
      }
      reader.readAsText(this.fileToUpload);
    }
  }

  uploadFileAssoc(files: FileList) {
    this.fileToUpload = files.item(0);

    if (this.fileToUpload) {
      this.frameService.showLoader()
      let reader = new FileReader();
      reader.onload = async () => {
        try {
          this.textCalc = reader.result.toString();
          let assocObjects = JSON.parse(this.textCalc);
          let assocsRequest = [];
          assocObjects.Games.forEach(game => {
            let assocObj = {
              A1: game.A.A1,
              A2: game.A.A2,
              A3: game.A.A3,
              A4: game.A.A4,
              A: game.A.A_sol.replace("/", ","),
              B1: game.B.B1,
              B2: game.B.B2,
              B3: game.B.B3,
              B4: game.B.B4,
              B: game.B.B_sol.replace("/", ","),
              C1: game.C.C1,
              C2: game.C.C2,
              C3: game.C.C3,
              C4: game.C.C4,
              C: game.C.C_sol.replace("/", ","),
              D1: game.D.D1,
              D2: game.D.D2,
              D3: game.D.D3,
              D4: game.D.D4,
              D: game.D.D_sol.replace("/", ","),
              Final: game.final_sol.replace("/", ","),
            }

            assocsRequest.push(assocObj);
          });

          await this.httpService.addAssocsUpload(assocsRequest).subscribe(
            (res: any) => {
              //ON SUCCESS
              this.frameService.hideLoader();
              this.frameService.showToastPrime('Uspešno!', 'Uspešno ste dodali nove igre asocijacije', 'success', 4000);
            },
            error => {
              let errorText = error && error.error && error.error[0] ? error.error[0].value : 'Došlo je do greške prilikom dodavanja igara asocijacije';
              this.frameService.hideLoader();
              this.frameService.showToastPrime('Ups!', errorText, 'error', 4000);
              console.log(error);
            });

          console.log(this.textCalc);
          this.frameService.hideLoader();
        }
        catch (error) {
          this.frameService.hideLoader();
          this.frameService.showToastPrime('Ups!', 'Greška prilikom čitanja dokumenta. Moguća greška u strukturi vašeg dokumenta. Molimo vas da proverite.', 'error', 4000);
        }
      }
      reader.readAsText(this.fileToUpload);
    }
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

  closeWordDialog() {
    this.slagalicaForm.reset();
    this.showWordDialog = false;
    this.formSubmitAttempt = false;
  }

  closeConnectionsGameDialog() {
    this.connForm.reset();
    this.showConnDialog = false;
    this.formConnSubmitAttempt = false;
  }

  closeAssocDialog() {
    this.assocForm.reset();
    this.showAssocDialog = false;
    this.formAssocSubmitAttempt = false;
  }

  async saveWord() {
    this.formSubmitAttempt = true;
    if (this.slagalicaForm.valid) {
      this.frameService.showLoader();
      let formValue = this.slagalicaForm.value;
      await this.httpService.addWord(formValue).subscribe(
        (res: any) => {
          //ON SUCCESS
          this.frameService.hideLoader();
          this.showWordDialog = false;
          this.slagalicaForm.reset();
          this.frameService.showToastPrime('Uspešno!', 'Uspešno ste dodali novu reč', 'success', 4000);
        },
        error => {
          let errorText = error && error.error && error.error[0] ? error.error[0].value : 'Došlo je do greške prilikom dodavanja reči';
          this.frameService.hideLoader();
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
          let errorText = error && error.error && error.error[0] ? error.error[0].value : 'Došlo je do greške prilikom dodavanja igre spojnica';
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
      this.frameService.showLoader();
      let formValue = this.assocForm.value;

      let assocRequest = this.packAssocRequest(formValue);

      await this.httpService.addAssocGame(assocRequest).subscribe(
        (res: any) => {
          //ON SUCCESS
          this.frameService.hideLoader();
          this.showAssocDialog = false;
          this.assocForm.reset();
          this.frameService.showToastPrime('Uspešno!', 'Uspešno ste dodali novu igru Asocijacije', 'success', 4000);
        },
        error => {
          let errorText = error && error.error && error.error[0] ? error.error[0].value : 'Došlo je do greške prilikom dodavanja igre Asocijacije';
          this.frameService.hideLoader();
          this.showAssocDialog = false;
          this.assocForm.reset();
          this.frameService.showToastPrime('Ups!', errorText, 'error', 4000);
          console.log(error);
        });
    }
  }

  packConnectionsData(formValue: any) {
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

  packAssocRequest(assocFormValue: any) {
    assocFormValue.A = assocFormValue.A.replace(/\s\s+/g, ' ').replace(/,+/g, ',').trim();
    assocFormValue.B = assocFormValue.B.replace(/\s\s+/g, ' ').replace(/,+/g, ',').trim();
    assocFormValue.C = assocFormValue.C.replace(/\s\s+/g, ' ').replace(/,+/g, ',').trim();
    assocFormValue.D = assocFormValue.D.replace(/\s\s+/g, ' ').replace(/,+/g, ',').trim();
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
    assocFormValue.Final = assocFormValue.Final.replace(/\s\s+/g, ' ').replace(/,+/g, ',').trim();

    return assocFormValue;
  }
}
