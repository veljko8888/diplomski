import { Component, OnInit } from '@angular/core';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FrameService } from 'app/@core/mock/frame.service';

@Component({
  selector: 'ngx-user-play',
  templateUrl: './user-play.component.html',
  styleUrls: ['./user-play.component.scss']
})
export class UserPlayComponent implements OnInit {

  constructor(
    private httpService: HttpHandlerService,
    private frameService: FrameService
  ) { }

  points = 0;
  infoMsg = '';

  skockoActive = false;

  chosenNumsOrder = [];
  chosenNumsOrderLengthSeparate = [];
  finalNum;
  num2 = [10, 15, 20];
  num3 = [25, 50, 75, 100];
  expression = '';
  numsArray = [{ value: '', clicked: false }, { value: '', clicked: false }, { value: '', clicked: false }, { value: '', clicked: false }, { value: '', clicked: false }, { value: '', clicked: false }, { value: '(', clicked: false }, { value: ')', clicked: false }, { value: '-', clicked: false }, { value: '+', clicked: false }, { value: '*', clicked: false }, { value: '/', clicked: false }];
  mojBrojActive = false;
  numGameTimeStarted = false;

  slagalicaActive = true;
  wordGameTimeStarted = false;
  wordSolution: string = '';
  chosenCharsOrder = [];
  charsArray = [{ value: '', clicked: false }, { value: '', clicked: false }, { value: '', clicked: false }, { value: '', clicked: false }, { value: '', clicked: false }, { value: '', clicked: false }, { value: '', clicked: false }, { value: '', clicked: false }, { value: '', clicked: false }, { value: '', clicked: false }, { value: '', clicked: false }, { value: '', clicked: false }];
  timeLeft: number = 60;
  interval;
  showDailyGameDialog: boolean = false;
  chars: any[] = ['А', 'Б', 'В', 'Г', 'Д', 'Ђ', 'Е', 'Ж', 'З', 'И', 'Ј',
    'К', 'Л', 'Љ', 'М', 'Н', 'Њ', 'О', 'П', 'Р', 'С', 'Т',
    'Ћ', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Џ', 'Ш'];

  ngOnInit(): void {
  }

  createGame() {

  }

  connectToGame() {

  }

  playDailyGame() {
    this.showDailyGameDialog = true;
  }

  showStats() {

  }

  async saveWord() {
    await this.checkValidWordAndCalcPoints();
  }

  closeDailyGameDialog() {
    this.points = 0;
    this.resetWordGameVariables();
    this.resetNumGameVariables();
    this.resetSkockoGameVariables();
    this.slagalicaActive = true;
  }

  resetSkockoGameVariables() {
    this.skockoActive = false;
  }

  resetNumGameVariables() {
    this.numGameTimeStarted = false;
    this.mojBrojActive = false;
    this.expression = '';
    this.timeLeft = 60;
    this.chosenNumsOrderLengthSeparate = [];
    this.chosenNumsOrder = [];
    this.numsArray = [
      { value: '', clicked: false }, { value: '', clicked: false },
      { value: '', clicked: false }, { value: '', clicked: false },
      { value: '', clicked: false }, { value: '', clicked: false },
      { value: '(', clicked: false }, { value: ')', clicked: false },
      { value: '-', clicked: false }, { value: '+', clicked: false },
      { value: '*', clicked: false }, { value: '/', clicked: false }];
  }

  resetWordGameVariables() {
    this.showDailyGameDialog = false;
    clearInterval(this.interval);
    this.wordSolution = '';
    this.wordGameTimeStarted = false;
    this.timeLeft = 60;
    this.chosenCharsOrder = [];
    this.charsArray = [
      { value: '', clicked: false }, { value: '', clicked: false },
      { value: '', clicked: false }, { value: '', clicked: false },
      { value: '', clicked: false }, { value: '', clicked: false },
      { value: '', clicked: false }, { value: '', clicked: false },
      { value: '', clicked: false }, { value: '', clicked: false },
      { value: '', clicked: false }, { value: '', clicked: false }];
  }

  pickChars() {
    this.wordGameTimeStarted = true;
    this.charsArray.forEach(char => {
      char.value = this.chars[Math.floor(Math.random() * 30) + 1 - 1]
    });
    this.startTimer(1);
  }

  pickNums() {
    this.numGameTimeStarted = true;
    for (let i = 0; i < 6; i++) {
      if (i < 4) {
        this.numsArray[i].value = (Math.floor(Math.random() * 9) + 1).toString();
      }
      else if (i == 4) {
        this.numsArray[i].value = this.num2[(Math.floor(Math.random() * 3) + 1 - 1).toString()].toString();
      }
      else {
        this.numsArray[i].value = this.num3[(Math.floor(Math.random() * 4) + 1 - 1).toString()].toString();
      }
    }
    this.finalNum = Math.floor(Math.random() * 999) + 1;
    this.startTimer(2);
  }

  startTimer(game: number) {
    this.interval = setInterval(async () => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        if (game == 1) {
          await this.checkValidWordAndCalcPoints();
        }
        else if (game == 2) {
          this.checkValidExpressionAndCalcPoints();
        }
      }
    }, 1000)
  }

  chooseChar(index: number) {
    if (!this.charsArray[index].clicked && this.wordGameTimeStarted) {
      this.chosenCharsOrder.push(index);
      this.charsArray[index].clicked = !this.charsArray[index].clicked;
      this.wordSolution = this.wordSolution.concat(this.charsArray[index].value);
    }
  }

  chooseNum(index: number) {
    if (!this.numsArray[index].clicked && this.numGameTimeStarted) {
      this.chosenNumsOrder.push(index);
      this.chosenNumsOrderLengthSeparate.push(this.numsArray[index].value.length);
      if (index < 6) {
        this.numsArray[index].clicked = !this.numsArray[index].clicked;
      }
      this.expression = this.expression.concat(this.numsArray[index].value) + ' ';
    }
  }

  deleteLastChar() {
    if (this.wordSolution.length > 0) {
      let length = this.chosenCharsOrder.length;
      this.charsArray[this.chosenCharsOrder[length - 1]].clicked = false;
      this.chosenCharsOrder.splice(-1, 1);
      this.wordSolution = this.wordSolution.substring(0, this.wordSolution.length - 1);
    }
  }

  deleteLastNum() {
    if (this.expression.length > 0) {
      let length = this.chosenNumsOrder.length;
      this.numsArray[this.chosenNumsOrder[length - 1]].clicked = false;
      this.chosenNumsOrder.splice(-1, 1);
      this.expression = this.expression.substring(0, this.expression.length - 1 - this.chosenNumsOrderLengthSeparate[this.chosenNumsOrderLengthSeparate.length - 1]);
      this.chosenNumsOrderLengthSeparate.splice(-1, 1);
    }
  }

  deleteAll() {
    this.chosenCharsOrder = [];
    this.charsArray.forEach(char => {
      char.clicked = false;
    });
    this.wordSolution = '';
  }

  deleteAllNum() {
    this.chosenNumsOrder = [];
    this.chosenNumsOrderLengthSeparate = [];
    this.numsArray.forEach(num => {
      num.clicked = false;
    });
    this.expression = '';
  }

  async checkValidWordAndCalcPoints() {
    let wordRequest = {
      Rec: this.wordSolution //'ЧИГОТА'
    }
    await this.httpService.checkValidWord(wordRequest).subscribe(
      (res: any) => {
        //ON SUCCESS
        this.frameService.hideLoader();
        this.frameService.showToastPrime('Uspešno!', 'Vaša reč je validna', 'success', 4000);
        let slagalicaPoints = this.wordSolution.length * 2;
        this.points += slagalicaPoints;
        clearInterval(this.interval);
        this.timeLeft = 60;
        this.infoMsg = `Osvojili ste ${slagalicaPoints} poena u ovoj igri. Uskoro počinje sledeća igra...`
        setTimeout(() => {
          this.slagalicaActive = false;
          this.mojBrojActive = true;
          this.infoMsg = '';
        }, 5000);
      },
      error => {
        let errorText = error && error.error && error.error[0] ? error.error[0].value : 'Došlo je do greške prilikom provere reči';
        this.frameService.hideLoader();
        clearInterval(this.interval);
        this.timeLeft = 60;
        this.frameService.showToastPrime('Ups!', errorText, 'error', 4000);
        this.infoMsg = `Osvojili ste 0 poena u ovoj igri. Uskoro počinje sledeća igra...`;
        setTimeout(() => {
          this.slagalicaActive = false;
          this.mojBrojActive = true;
          this.infoMsg = '';
        }, 5000);
        console.log(error);
      });
  }

  checkValidExpressionAndCalcPoints() {
    try {
      let mojBrojPoints = 0;
      let calcResult = eval(this.expression);
      if (Number.isInteger(calcResult)) {
        if (calcResult == this.finalNum) {
          mojBrojPoints = 10;
          this.points += mojBrojPoints;
        }
        else if ((calcResult - this.finalNum <= 5  && calcResult - this.finalNum >= -5) 
                  || (this.finalNum - calcResult <= 5 && this.finalNum - calcResult >= -5)) {
          mojBrojPoints = 5;
          this.points += mojBrojPoints;
        }
      }

      this.infoMsg = `Osvojili ste ${mojBrojPoints} poena u ovoj igri. Uskoro počinje sledeća igra...`
    }
    catch (error) {
      this.infoMsg = `Osvojili ste 0 poena u ovoj igri. Postoji greška u vašem izrazu. Uskoro počinje sledeća igra...`
    }
    finally {
      clearInterval(this.interval);
      this.timeLeft = 60;
      setTimeout(() => {
        this.mojBrojActive = false;
        this.skockoActive = true;
        this.infoMsg = '';
      }, 5000);
    }
  }
}
