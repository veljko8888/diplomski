import { HttpClientService } from './../shared/httpclient.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LexiconDto } from '../Dtos/models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  userDetails;

  displayDialog: boolean;
  showDeleteButton: boolean = true;

  errorMsg: string = null;
  textCalc: string = null;
  checklists: string = null;

  lexicon: LexiconDto = {};
  selectedLexicon: LexiconDto;
  newLexicon: boolean;
  allLexicons: any[];
  lexicons: any[];
  cols: any[];

  fileToUpload: File = null;
  readText: any;

  sentimentCalculationResult = 0;
  wordsNotPresentInTheDictionary = 0;

  map: Map<string, number> = new Map<string, number>();

  constructor(
    private router: Router,
    private service: HttpClientService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.cols = [
      { field: 'word', header: 'word' },
      { field: 'sentimentScore', header: 'sentimentScore' }
    ];

    this.getUserProfile();
    this.getLexicons();
  }

  async getUserProfile() {
    await this.getUserInfo();
  }

  async getUserInfo() {
    this.service.getUserProfile().subscribe(
      res => {
        this.userDetails = res;
      },
      err => {
        console.log(err);
      },
    );
  }

  async getLexicons() {
    await this.getLexiconsData();
  }

  async getLexiconsData() {
    this.service.getLexicons().subscribe(
      (res: any) => {
        this.allLexicons = this.lexicons = res;
        this.createDictionaryOfWords();
      },
      error => {
        error.error.forEach(error => {
          this.toastr.error(error.Value, 'ERROR!');
        });
      }
    );
  }

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }

  showDialogToAdd() {
    this.newLexicon = true;
    this.lexicon = {};
    this.displayDialog = true;
    this.showDeleteButton = false;
  }

  async save(lexiconDto: any) {
    if (lexiconDto.sentimentScore && this.isNumber(lexiconDto.sentimentScore)
      && lexiconDto.sentimentScore > -1 && lexiconDto.sentimentScore < 1 && !(/\s/.test(lexiconDto.word))) {
      lexiconDto.sentimentScore = +lexiconDto.sentimentScore;
      await this.addLexicon(lexiconDto);
      this.lexicon = null;
      this.displayDialog = false;
    }
    else {
      this.errorMsg = 'Please enter Word without white spaces and Sentiment score between -1 and 1';
    }
  }

  async addLexicon(lexiconDto) {
    this.service.addLexicon(lexiconDto).subscribe(
      (res: any) => {
        if (lexiconDto.id) {
          var oldLexiconName = this.allLexicons.find(x => x.id == lexiconDto.id).word;
          this.map.delete(oldLexiconName);
          this.map.set(lexiconDto.word, lexiconDto.sentimentScore);
        }
        else {
          this.map.set(lexiconDto.word, lexiconDto.sentimentScore);
        }

        this.allLexicons = this.lexicons = res;
        this.toastr.success('Successfully saved Lexicon!', 'Lexicon Added');
      },
      error => {
        error.error.forEach(error => {
          this.toastr.error(error.Value, 'ERROR!');
        });
      }
    );
  }

  async delete(lexiconDto: any) {
    await this.deleteLexicon(lexiconDto);
    this.lexicon = null;
    this.displayDialog = false;
  }

  async deleteLexicon(lexiconDto) {
    this.service.removeLexicon(lexiconDto).subscribe(
      (res: any) => {
        this.allLexicons = this.lexicons = res;
        this.map.delete(lexiconDto.word);
        this.toastr.success('Successfully removed Lexicon!', 'Lexicon Removed');
      },
      error => {
        error.error.forEach(error => {
          this.toastr.error(error.Value, 'ERROR!');
        });
      }
    );
  }

  onRowSelect(event) {
    this.newLexicon = false;
    this.lexicon = this.cloneLexicon(event.data);
    this.displayDialog = true;
    this.showDeleteButton = true;
  }

  cloneLexicon(lexiconDto: LexiconDto): LexiconDto {
    let lexicon = {};
    for (let prop in lexiconDto) {
      lexicon[prop] = lexiconDto[prop];
    }
    return lexicon;
  }

  allWords() {
    this.lexicons = this.allLexicons;
  }

  onlyPositive() {
    this.lexicons = this.allLexicons.filter(x => x.sentimentScore > 0);
  }

  onlyNegative() {
    this.lexicons = this.allLexicons.filter(x => x.sentimentScore < 0);
  }

  createDictionaryOfWords() {
    this.allLexicons.forEach(element => {
      this.map.set(element.word, element.sentimentScore);
    });
  }

  calculate() {
    this.wordsNotPresentInTheDictionary = 0;
    this.sentimentCalculationResult = 0;

    var textWithoutDots = this.textCalc.replace(/\./g, '');
    var wordsArray = textWithoutDots.split(/\s+|,?\s+/);

    var numberOfWordsInsideDictionary = 0;
    var sumOfSentiments = 0;
    wordsArray.forEach(element => {
      if (this.map.has(element)) {
        sumOfSentiments += this.map.get(element);
        numberOfWordsInsideDictionary++;
      }
      else {
        this.wordsNotPresentInTheDictionary++;
      }
    });

    this.sentimentCalculationResult = sumOfSentiments / numberOfWordsInsideDictionary;
  }

  uploadFile(files: FileList) {
    this.fileToUpload = files.item(0);

    let reader = new FileReader();
    reader.onload = () => {
      this.textCalc = reader.result.toString();
    }
    reader.readAsText(this.fileToUpload);
  }

  isNumber(value: string | number): boolean {
    return ((value != null) &&
      (value !== '') &&
      !isNaN(Number(value.toString())));
  }

  getChecklists(){
    this.service.getChecklists().subscribe(
      (res: any) => {
        this.checklists = res;
      },
      error => {
        error.error.forEach(error => {
          this.toastr.error(error.Value, 'ERROR!');
        });
      }
    );
  }
}
