import { Component, OnInit } from '@angular/core';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FrameService } from 'app/@core/mock/frame.service';
import { UserService } from 'app/@core/mock/users.service';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'ngx-user-play',
  templateUrl: './user-play.component.html',
  styleUrls: ['./user-play.component.scss']
})
export class UserPlayComponent implements OnInit {

  constructor(
    private httpService: HttpHandlerService,
    private frameService: FrameService,
    private userService: UserService
  ) { }

  points = 0;
  infoMsg = '';

  asocijacijePoints = 0;
  asocijacijeActive = false;
  asocijacijeGameStarted = false;
  asocijacijeFields = null;
  asocijacijeBind = {
    Final: '',
    A1: 'A1',
    A2: 'A2',
    A3: 'A3',
    A4: 'A4',
    A: '',
    B1: 'B1',
    B2: 'B2',
    B3: 'B3',
    B4: 'B4',
    B: '',
    C1: 'C1',
    C2: 'C2',
    C3: 'C3',
    C4: 'C4',
    C: '',
    D1: 'D1',
    D2: 'D2',
    D3: 'D3',
    D4: 'D4',
    D: '',
  }


  spojniceDesc = '';
  spojnicePoints = 0;
  currentRow = -1;
  spojniceActive = false;
  spojniceGameStarted = false;
  spojniceParovi = [{ left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }];
  spojniceShuffledParovi = [{ left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }];

  skockoActive = false;
  skockoGameTimeStarted = false;
  skockoOptions = ['☺️', '🌟', '♦', '♣', '♥', '♠'];
  currentCombination = [
    { combinationStatus: [2, 2, 2, 2], combination: ['', '', '', ''], combinationSubmitted: false, allSignsChosen: false },
    { combinationStatus: [2, 2, 2, 2], combination: ['', '', '', ''], combinationSubmitted: false, allSignsChosen: false },
    { combinationStatus: [2, 2, 2, 2], combination: ['', '', '', ''], combinationSubmitted: false, allSignsChosen: false },
    { combinationStatus: [2, 2, 2, 2], combination: ['', '', '', ''], combinationSubmitted: false, allSignsChosen: false },
    { combinationStatus: [2, 2, 2, 2], combination: ['', '', '', ''], combinationSubmitted: false, allSignsChosen: false },
    { combinationStatus: [2, 2, 2, 2], combination: ['', '', '', ''], combinationSubmitted: false, allSignsChosen: false }
  ];
  currentCombinationIteration = 0;
  currentCombinationRow = 0;
  skockoCombination = [];

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

  showCreateGameDialog: boolean = false;
  waitCreateGame: string = '';

  showMultiplayerGamesDialog: boolean = false;
  games = [];

  ngOnInit(): void {
    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.httpService.BaseURICut + 'notify')
      .build();

    // connection.start().then(function () {  
    //   console.log('SignalR Connected!');  
    // }).catch(function (err) {  
    //   return console.error(err.toString());  
    // });  

    Object.defineProperty(WebSocket, 'OPEN', { value: 1, });
    connection
      .start()
      .then(() => {
        console.log('Connection started!');

      })
      .catch(err => {
        console.log(err);
      });

    connection.on("BroadcastMessage", () => {
      this.getGames();
    });
  }

  async createGame() {
    let request = {
      MultiplayerGameDate: this.formatDate(new Date()),
      Player1Id: this.userService.getCurrentUser().id
    }
    await this.httpService.createMultiplayerGame(request).subscribe(
      (res: any) => {
        this.waitCreateGame = 'Igra je kreirana, molimo sačekajte vašeg protivnika.'
      },
      error => {
        this.waitCreateGame = 'Greška prilikom kreiranja igre, molimo pokušajte ponovo.'
        console.log(error);
      });
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
    this.resetSpojniceGameVariables();
    this.resetAsocijacijeGameVariables();
    this.slagalicaActive = true;
  }

  closeCreateGameDialog() {
    this.showCreateGameDialog = false;
    this.waitCreateGame = '';
  }

  createGameDialog() {
    this.showCreateGameDialog = true;
  }

  async openMultiplayerGamesDialog() {
    this.showMultiplayerGamesDialog = true;
    this.frameService.showLoader();
    this.getGames();
  }

  async getGames(){
    await this.httpService.getMultiplayerGames().subscribe(
      (res: any) => {
        this.games = res;
        this.frameService.hideLoader();
      },
      error => {
        this.frameService.hideLoader();
        console.log(error);
      });
  }

  closeMultiplayerGamesDialog() {
    this.showMultiplayerGamesDialog = false;
  }

  resetSpojniceGameVariables() {
    this.spojniceActive = false;
    this.spojniceGameStarted = false;

    this.spojniceDesc = '';
    this.spojnicePoints = 0;
    this.currentRow = -1;
    this.spojniceParovi = [{ left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }];
    this.spojniceShuffledParovi = [{ left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }, { left: '', right: '', correct: false }];
  }

  resetAsocijacijeGameVariables() {
    this.asocijacijeActive = false;
    this.asocijacijeGameStarted = false;

    this.asocijacijePoints = 0;
    this.asocijacijeFields = null;
    this.asocijacijeBind = {
      Final: '',
      A1: 'A1',
      A2: 'A2',
      A3: 'A3',
      A4: 'A4',
      A: '',
      B1: 'B1',
      B2: 'B2',
      B3: 'B3',
      B4: 'B4',
      B: '',
      C1: 'C1',
      C2: 'C2',
      C3: 'C3',
      C4: 'C4',
      C: '',
      D1: 'D1',
      D2: 'D2',
      D3: 'D3',
      D4: 'D4',
      D: '',
    }
  }

  resetSkockoGameVariables() {
    this.skockoActive = false;
    this.skockoGameTimeStarted = false;
    this.currentCombination = [
      { combinationStatus: [2, 2, 2, 2], combination: ['', '', '', ''], combinationSubmitted: false, allSignsChosen: false },
      { combinationStatus: [2, 2, 2, 2], combination: ['', '', '', ''], combinationSubmitted: false, allSignsChosen: false },
      { combinationStatus: [2, 2, 2, 2], combination: ['', '', '', ''], combinationSubmitted: false, allSignsChosen: false },
      { combinationStatus: [2, 2, 2, 2], combination: ['', '', '', ''], combinationSubmitted: false, allSignsChosen: false },
      { combinationStatus: [2, 2, 2, 2], combination: ['', '', '', ''], combinationSubmitted: false, allSignsChosen: false },
      { combinationStatus: [2, 2, 2, 2], combination: ['', '', '', ''], combinationSubmitted: false, allSignsChosen: false }
    ];
    this.currentCombinationIteration = 0;
    this.currentCombinationRow = 0;
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

  pickSkocko() {
    this.skockoGameTimeStarted = true;
    this.skockoCombination[0] = this.skockoOptions[Math.floor(Math.random() * 6) + 1 - 1];
    this.skockoCombination[1] = this.skockoOptions[Math.floor(Math.random() * 6) + 1 - 1];
    this.skockoCombination[2] = this.skockoOptions[Math.floor(Math.random() * 6) + 1 - 1];
    this.skockoCombination[3] = this.skockoOptions[Math.floor(Math.random() * 6) + 1 - 1];
    this.startTimer(3);
  }

  pickAsocijacije() {
    this.asocijacijeGameStarted = true;
    this.startTimer(5);
  }

  async pickSpojnice() {
    this.spojniceGameStarted = true;
    let request = {
      DailyGameDate: this.formatDate(new Date())
    }
    await this.httpService.getDailyGame(request).subscribe(
      (res: any) => {
        this.asocijacijeFields = res.associations;
        this.spojniceDesc = res.connections.description;
        let i = 0;
        let assignedIndexes = [];
        res.connections.pairs.forEach(pair => {
          this.spojniceParovi[i].left = pair.left;
          this.spojniceParovi[i].right = pair.right;
          this.spojniceShuffledParovi[i].left = pair.left;
          let newIndex = Math.floor(Math.random() * 10);
          while (assignedIndexes.includes(newIndex)) {
            newIndex = Math.floor(Math.random() * 10);
          }
          assignedIndexes.push(newIndex);
          this.spojniceShuffledParovi[newIndex].right = pair.right;
          i++;
        });
        this.currentRow = 0;
      },
      error => {
        console.log(error);
      });
    this.startTimer(4);
  }

  openField(fieldName: string) {
    if (this.asocijacijeGameStarted) {
      let fieldNameLowerCaseFirst = fieldName[0].toLowerCase() + fieldName.slice(1);
      this.asocijacijeBind[fieldName] = this.asocijacijeFields[fieldNameLowerCaseFirst];
    }
  }

  submitFieldSolution(event: any, value: string, fieldName: string) {
    if (event.keyCode === 13) {
      let fieldNameLowerCaseFirst = fieldName[0].toLowerCase() + fieldName.slice(1);
      let solutionWords = this.asocijacijeFields[fieldNameLowerCaseFirst].split(',').map(v => v.toLowerCase());;
      let valueTrimmed = value.trim();
      if (solutionWords.includes(valueTrimmed.toLowerCase())) {
        if (fieldName == 'Final') {
          this.asocijacijePoints += 10;
          let countUnsolvedGroups = 0;
          if (this.asocijacijeBind['A'] == '') {
            countUnsolvedGroups++;
          }
          if (this.asocijacijeBind['B'] == '') {
            countUnsolvedGroups++;
          }
          if (this.asocijacijeBind['C'] == '') {
            countUnsolvedGroups++;
          }
          if (this.asocijacijeBind['D'] == '') {
            countUnsolvedGroups++;
          }

          if (countUnsolvedGroups > 0) {
            this.asocijacijePoints += countUnsolvedGroups * 5;
          }

          this.checkAsocijacijeAndCalculatePoints();
        }
        else if (fieldName == 'A') {
          this.asocijacijePoints += 5;
          this.asocijacijeBind['A'] = this.asocijacijeFields['a'];
          this.asocijacijeBind['A1'] = this.asocijacijeFields['a1'];
          this.asocijacijeBind['A2'] = this.asocijacijeFields['a2'];
          this.asocijacijeBind['A3'] = this.asocijacijeFields['a3'];
          this.asocijacijeBind['A4'] = this.asocijacijeFields['a4'];
        }
        else if (fieldName == 'B') {
          this.asocijacijePoints += 5;
          this.asocijacijeBind['B'] = this.asocijacijeFields['b'];
          this.asocijacijeBind['B1'] = this.asocijacijeFields['b1'];
          this.asocijacijeBind['B2'] = this.asocijacijeFields['b2'];
          this.asocijacijeBind['B3'] = this.asocijacijeFields['b3'];
          this.asocijacijeBind['B4'] = this.asocijacijeFields['b4'];
        }
        else if (fieldName == 'C') {
          this.asocijacijePoints += 5;
          this.asocijacijeBind['C'] = this.asocijacijeFields['c'];
          this.asocijacijeBind['C1'] = this.asocijacijeFields['c1'];
          this.asocijacijeBind['C2'] = this.asocijacijeFields['c2'];
          this.asocijacijeBind['C3'] = this.asocijacijeFields['c3'];
          this.asocijacijeBind['C4'] = this.asocijacijeFields['c4'];
        }
        else if (fieldName == 'D') {
          this.asocijacijePoints += 5;
          this.asocijacijeBind['D'] = this.asocijacijeFields['d'];
          this.asocijacijeBind['D1'] = this.asocijacijeFields['d1'];
          this.asocijacijeBind['D2'] = this.asocijacijeFields['d2'];
          this.asocijacijeBind['D3'] = this.asocijacijeFields['d3'];
          this.asocijacijeBind['D4'] = this.asocijacijeFields['d4'];
        }
      }
      else {
        this.asocijacijeBind[fieldName] = '';
        this.frameService.showToastPrime('Netačno', 'Vaša asocijacija nije tačna', 'error', 2000);
      }
    }
  }

  selectSign(sign: any) {
    if (!this.currentCombination[this.currentCombinationRow].allSignsChosen && this.skockoGameTimeStarted) {
      this.currentCombination[this.currentCombinationRow].combination[this.currentCombinationIteration++] = sign;
      if (this.currentCombinationIteration > 3) {
        this.currentCombination[this.currentCombinationRow].allSignsChosen = true;
        this.currentCombinationIteration = 0;
      }
    }
  }

  resetCombination() {
    this.currentCombination[this.currentCombinationRow].combination = ['', '', '', ''];
    this.currentCombination[this.currentCombinationRow].allSignsChosen = false;
    this.currentCombinationIteration = 0;
  }

  submitRowCombination() {
    let correctSignAndPlace = 0;
    let correctSign = 0;
    let i = 0;
    this.skockoCombination.forEach(element => {
      if (element == this.currentCombination[this.currentCombinationRow].combination[i++]) {
        correctSignAndPlace++;
      }
    });
    i = 0;

    const map = this.currentCombination[this.currentCombinationRow].combination.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    let keys = [...map.keys()];
    let values = [...map.values()];
    let j = 0;
    let combinationEntries: Map<any, number> = new Map<any, number>();
    keys.forEach(key => {
      combinationEntries.set(key, values[j]);
    });

    const mapSolution = this.skockoCombination.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    keys = [...mapSolution.keys()];
    values = [...mapSolution.values()];
    j = 0;
    let solutionEntries: Map<any, number> = new Map<any, number>();
    keys.forEach(key => {
      solutionEntries.set(key, values[j]);
    });

    combinationEntries.forEach((value: number, key: any) => {
      if (solutionEntries.get(key)) {
        correctSign += value < solutionEntries.get(key) ? value : solutionEntries.get(key);
      }
    });

    for (let k = 0; k < correctSignAndPlace; k++) {
      this.currentCombination[this.currentCombinationRow].combinationStatus[k] = 0;
    }
    for (let k = correctSignAndPlace; k < correctSign; k++) {
      this.currentCombination[this.currentCombinationRow].combinationStatus[k] = 1;
    }


    this.currentCombination[this.currentCombinationRow].combinationSubmitted = true;
    this.currentCombinationIteration = 0;
    this.currentCombinationRow++;

    if (correctSignAndPlace == 4) {
      this.points += 10;
      this.infoMsg = "Pogodak! Osvojili ste 10 poena u ovoj igri.";
      clearInterval(this.interval);
      this.timeLeft = 60;
      setTimeout(() => {
        this.skockoActive = false;
        this.spojniceActive = true;
        this.infoMsg = '';
      }, 5000);
    }
    else if (this.currentCombinationRow > 5) {
      this.checkSkockoCombinationAndCalculatePoints();
    }
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
        else if (game == 3) {
          this.checkSkockoCombinationAndCalculatePoints();
        }
        else if (game == 4) {
          this.checkSpojniceAndCalculatePoints();
        }
        else if (game == 5) {
          this.checkAsocijacijeAndCalculatePoints();
        }
      }
    }, 1000)
  }

  checkConnection(index: number) {
    if (this.spojniceShuffledParovi[index].correct == false) {
      if (this.spojniceShuffledParovi[index].right == this.spojniceParovi[this.currentRow].right) {
        this.spojniceParovi[this.currentRow].correct = true;
        this.spojniceShuffledParovi[index].correct = true;
        this.spojnicePoints += 1;
      }

      if (this.currentRow == 9) {
        this.checkSpojniceAndCalculatePoints();
      }

      this.currentRow++;
    }
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
        else if ((calcResult - this.finalNum <= 5 && calcResult - this.finalNum >= -5)
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

  checkSkockoCombinationAndCalculatePoints() {
    this.infoMsg = `Osvojili ste 0 poena u ovoj igri. Uskoro počinje sledeća igra...`;
    clearInterval(this.interval);
    this.timeLeft = 60;
    setTimeout(() => {
      this.skockoActive = false;
      this.spojniceActive = true;
      this.infoMsg = '';
    }, 5000);
  }

  checkSpojniceAndCalculatePoints() {
    this.infoMsg = `Osvojili ste ${this.spojnicePoints} poena u ovoj igri. Uskoro počinje sledeća igra...`;
    this.points += this.spojnicePoints;
    clearInterval(this.interval);
    this.timeLeft = 240;
    setTimeout(() => {
      this.spojniceActive = false;
      this.asocijacijeActive = true;
      this.infoMsg = '';
    }, 5000);
  }

  async checkAsocijacijeAndCalculatePoints() {
    //POSALJI REQUEST ZA ENDGAME UKUPNO POENA ITD
    this.populateAllFields();
    this.infoMsg = `Osvojili ste ${this.asocijacijePoints} poena u ovoj igri. Igra je završena.`;
    this.points += this.asocijacijePoints;
    clearInterval(this.interval);
    this.timeLeft = 60;
    let request = {
      Points: this.points,
      DailyGameDate: this.formatDate(new Date()),
      UserId: this.userService.getCurrentUser().id
    }
    await this.httpService.saveDailyGame(request).subscribe(
      (res: any) => {
        //ON SUCCESS
        this.frameService.showToastPrime('Uspešno!', 'Završena igra.', 'success', 4000);
      },
      error => {
        let errorText = error && error.error && error.error[0] ? error.error[0].value : 'Došlo je do greške prilikom završetka igre.';
        this.frameService.showToastPrime('Ups!', errorText, 'error', 4000);
      });
    setTimeout(() => {
      this.asocijacijeActive = false;
      this.infoMsg = '';
    }, 5000);
  }

  populateAllFields() {
    this.asocijacijeBind['Final'] = this.asocijacijeFields['final'];
    this.asocijacijeBind['A'] = this.asocijacijeFields['a'];
    this.asocijacijeBind['B'] = this.asocijacijeFields['b'];
    this.asocijacijeBind['C'] = this.asocijacijeFields['c'];
    this.asocijacijeBind['D'] = this.asocijacijeFields['d'];

    this.asocijacijeBind['A1'] = this.asocijacijeFields['a1'];
    this.asocijacijeBind['A2'] = this.asocijacijeFields['a2'];
    this.asocijacijeBind['A3'] = this.asocijacijeFields['a3'];
    this.asocijacijeBind['A4'] = this.asocijacijeFields['a4'];
    this.asocijacijeBind['B1'] = this.asocijacijeFields['b1'];
    this.asocijacijeBind['B2'] = this.asocijacijeFields['b2'];
    this.asocijacijeBind['B3'] = this.asocijacijeFields['b3'];
    this.asocijacijeBind['B4'] = this.asocijacijeFields['b4'];
    this.asocijacijeBind['C1'] = this.asocijacijeFields['c1'];
    this.asocijacijeBind['C2'] = this.asocijacijeFields['c2'];
    this.asocijacijeBind['C3'] = this.asocijacijeFields['c3'];
    this.asocijacijeBind['C4'] = this.asocijacijeFields['c4'];
    this.asocijacijeBind['D1'] = this.asocijacijeFields['d1'];
    this.asocijacijeBind['D2'] = this.asocijacijeFields['d2'];
    this.asocijacijeBind['D3'] = this.asocijacijeFields['d3'];
    this.asocijacijeBind['D4'] = this.asocijacijeFields['d4'];
  }
}
