import { Component, OnInit } from '@angular/core';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FrameService } from 'app/@core/mock/frame.service';
import { UserService } from 'app/@core/mock/users.service';
import * as signalR from '@microsoft/signalr';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

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
  connection: signalR.HubConnection;


  showMultiplayerDialog: boolean = false;
  timeLeftMultiplayer: number = 60;
  pointsOpponent: number = 0;
  mojBrojPoints: number = 0;
  player2Freeze = false;
  player1Freeze = false;
  oneFieldOpened = false;
  solvedColumns = [];
  opponentSolvedColumns = [];
  colApoints = 0;
  colBpoints = 0;
  colCpoints = 0;
  colDpoints = 0;
  finalSolPoints = 0;
  isFinalSolved = false;
  isFirstRoundSolved = false;
  isSecondRoundSolved = false;

  player1SlagalicaPoints = 0;
  player1MojBrojPoints = 0;
  player1SkockoPoints = 0;
  player1SpojnicePoints = 0;
  player1AsocijacijePoints = 0;
  player2SlagalicaPoints = 0;
  player2MojBrojPoints = 0;
  player2SkockoPoints = 0;
  player2SpojnicePoints = 0;
  player2AsocijacijePoints = 0;

  gameFinished = false;
  finalSolAsocijacijePoints = 0;

  ngOnInit(): void {
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.httpService.BaseURICut + 'notify')
      .build();

    Object.defineProperty(WebSocket, 'OPEN', { value: 1, });
    this.connection
      .start()
      .then(() => {
        console.log('Connection started!');

      })
      .catch(err => {
        console.log(err);
      });

    this.connection.on("BroadcastMessage", () => {
      this.getGames();
    });

    this.connection.on("GameStarted", () => {
      this.showMultiplayerDialog = true;
      if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player1Id) {

      } else {
        this.frameService.showLoader();
      }
    });

    this.connection.on("CountdownTimer", () => {
      if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
        this.getChars();
        this.startTimer(1, true);
        this.wordGameTimeStarted = true;
      }
    });

    this.connection.on("CountdownTimerNums", () => {
      if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
        this.getNums();
        this.startTimer(2, true);
        this.numGameTimeStarted = true;
      }
    });

    this.connection.on("CountdownTimerSkocko", () => {
      if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
        this.frameService.showLoader();
        this.getCombination();
        this.startTimerPassive();
      }
    });

    this.connection.on("CountdownTimerSpojnice", () => {
      let gameState = this.userService.getSpojniceGameState();
      if (gameState == 1 || gameState == null || gameState == undefined) {
        if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
          this.getSpojnice();
          this.startTimerPassive();
        }
        else {
          this.getSpojnice();
          this.startTimer(4, true);
        }
      }
      else if (gameState == 2) {
        if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
          this.startTimer(4, true);
          this.spojniceGameStarted = true;
        }
        else {
          this.startTimerPassive();
        }
      }
      else if (gameState == 3) {
        if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
          this.startTimer(4, true);
          this.spojniceGameStarted = true;
        }
        else {
          this.startTimerPassive();
        }
      }
      else if (gameState == 4) {
        if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player1Id) {
          this.startTimer(4, true);
          this.spojniceGameStarted = true;
        }
        else {
          this.startTimerPassive();
        }
      }

    });

    this.connection.on("CountdownTimerAssoc", () => {
      if (!this.isFirstRoundSolved) {
        if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
          this.getAssoc();
          this.startTimerPassive();
        }
        else {
          this.getAssoc();
          this.startTimer(5, true);
        }
      }
      else if (this.isFirstRoundSolved && !this.isSecondRoundSolved) {
        if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
          this.getAssoc(true);
          this.startTimer(5, true);
        }
        else {
          this.getAssoc(true);
          this.startTimerPassive();
        }
      }
    });

    this.connection.on("TimesUpAssoc", () => {
      if (!this.isFirstRoundSolved) {
        if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
          this.populateAllFields();
          setTimeout(() => {
            this.resetAssocForMulti();
            this.frameService.hideLoader();
            this.timeLeftMultiplayer = 240;
            this.getAssoc(true);
            this.isFirstRoundSolved = true;
            clearInterval(this.interval);
          }, 5000);
        }
        else {
          this.populateAllFields();
          setTimeout(() => {
            this.resetAssocForMulti();
            this.frameService.showLoader();
            this.timeLeftMultiplayer = 240;
            this.getAssoc(true);
            this.isFirstRoundSolved = true;
            clearInterval(this.interval);
          }, 5000);
        }
      }
      else if (this.isFirstRoundSolved && !this.isSecondRoundSolved) {
        this.populateAllFields();
        setTimeout(() => {
          this.frameService.hideLoader();
          this.checkAsocijacijeAndCalculatePoints(true);
        }, 5000);
      }
    });


    this.connection.on("FieldOpened", () => {
      this.getOpenedField()
    });


    this.connection.on("SpojniceSecondRound", () => {
      if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
        this.getSpojnice(true);
        this.calcPointsOpponent();
        this.spojniceGameStarted = false;
        this.timeLeftMultiplayer = 60;
        clearInterval(this.interval);
        this.userService.saveSpojniceGameState(3);
        this.frameService.hideLoader();
      }
      else {
        this.getSpojnice(true);
        this.calcPointsOpponent();
        this.skockoGameTimeStarted = true;
        this.timeLeftMultiplayer = 60;
        clearInterval(this.interval);
        this.userService.saveSpojniceGameState(3);
        this.frameService.showLoader();
      }
    });

    this.connection.on("NotifyOpponentForAssocSol", () => {
      this.getFromOpponentAssoc();
    });


    this.connection.on("CountdownTimerSkockoPlayer2", () => {
      if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player1Id) {
        this.frameService.showLoader();
        this.getCombination();
        this.startTimerPassive();
      }
    });

    this.connection.on("WordsFinished", () => {
      this.checkValidWordAndCalcPoints(true);
      if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
        this.frameService.showLoader();
      }
    });

    this.connection.on("NumsFinished", () => {
      this.getOpponentCalculation();
      if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
        this.frameService.showLoader();
      }
    });


    this.connection.on("NextPlayerSkocko", () => {
      if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
        this.frameService.hideLoader();
        this.skockoGameTimeStarted = false;
        this.timeLeftMultiplayer = 60;
        clearInterval(this.interval);
        this.calcPointsOpponent();
      }
    });

    this.connection.on("NextPlayerAssoc", () => {
      this.getOnMove();
    });

    this.connection.on("NextGame", () => {
      if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player1Id) {
        this.frameService.hideLoader();
        this.calcPointsOpponent();
        clearInterval(this.interval);
        this.skockoActive = false;
        this.spojniceActive = true;
        this.infoMsg = '';
        this.timeLeftMultiplayer = 60;
      }
    });

    this.connection.on("MoveToAsoc", () => {
      this.userService.saveSpojniceGameState(5);
      if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player1Id) {
        this.frameService.hideLoader();
        this.calcPointsOpponent();
        clearInterval(this.interval);
        this.spojniceActive = false;
        this.asocijacijeActive = true;
        this.infoMsg = '';
        this.timeLeftMultiplayer = 240;
      }
      else {
        this.frameService.showLoader();
        this.calcPointsOpponent();
        clearInterval(this.interval);
        this.spojniceActive = false;
        this.asocijacijeActive = true;
        this.infoMsg = '';
        this.timeLeftMultiplayer = 240;
      }
    });


    this.connection.on("SpojniceState2", () => {
      if (this.userService.getSpojniceGameState() == 3) {
        if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player1Id) {
          this.userService.saveSpojniceGameState(4);
          this.getSpojniceAlreadyChecked();
          this.calcPointsOpponent();
          this.timeLeftMultiplayer = 60;
          clearInterval(this.interval);
          this.frameService.hideLoader();
        }
        else {
          this.points += this.spojnicePoints;
          this.spojnicePoints = 0;
          this.userService.saveSpojniceGameState(4); //OVO SMA PROMENIO SA 2 na 4 - PROVERI !!!
          this.timeLeftMultiplayer = 60;
          clearInterval(this.interval);
          this.frameService.showLoader();
        }
      }
      else {
        if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
          this.userService.saveSpojniceGameState(2);
          this.getSpojniceAlreadyChecked();
          this.calcPointsOpponent();
          this.timeLeftMultiplayer = 60;
          clearInterval(this.interval);
          this.frameService.hideLoader();
        }
        else {
          this.points += this.spojnicePoints;
          this.spojnicePoints = 0;
          this.userService.saveSpojniceGameState(2);
          this.timeLeftMultiplayer = 60;
          clearInterval(this.interval);
          this.frameService.showLoader();
        }
      }
    });

  }

  resetAssocForMulti() {
    this.timeLeftMultiplayer = 240;
    clearInterval(this.interval);
    this.oneFieldOpened = false;
    this.colApoints = 0;
    this.colBpoints = 0;
    this.colCpoints = 0;
    this.colDpoints = 0;
    this.finalSolPoints = 0;
    this.solvedColumns = [];
    this.opponentSolvedColumns = [];
    this.isFinalSolved = false;
    this.asocijacijePoints = 0;
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

  async handleAssocTimesUp() {
    let request = {
      gameId: this.userService.getCurrentGame().id,
      userId: this.userService.getCurrentUser().id,
    }
    await this.httpService.assocTimesUp(request).subscribe(
      (res: any) => {
      },
      error => {
        console.log(error);
      });
  }

  async getFromOpponentAssoc() {
    let request = {
      gameId: this.userService.getCurrentGame().id,
      userId: this.userService.getCurrentUser().id,
    }
    await this.httpService.getFromOpponentForAssoc(request).subscribe(
      (res: any) => {
        if (request.userId == res.playerIdWhoSolved) {
          if (this.solvedColumns.includes('Final')) {
            setTimeout(() => {
              this.resetAssocForMulti();
              if (this.userService.getCurrentUser().id == this.userService.getCurrentGame().player2Id) {
                this.frameService.hideLoader();
              }
              else {
                this.frameService.showLoader();
              }
              if (this.isSecondRoundSolved) {
                this.checkAsocijacijeAndCalculatePoints(true);
              }
            }, 5000);
          }
        }
        else {
          this.opponentSolvedColumns = res.solvedCols;
          if (this.opponentSolvedColumns.includes('A')) {
            this.asocijacijeBind['A'] = this.asocijacijeFields['a'];
            this.asocijacijeBind['A1'] = this.asocijacijeFields['a1'];
            this.asocijacijeBind['A2'] = this.asocijacijeFields['a2'];
            this.asocijacijeBind['A3'] = this.asocijacijeFields['a3'];
            this.asocijacijeBind['A4'] = this.asocijacijeFields['a4'];
          }
          if (this.opponentSolvedColumns.includes('B')) {
            this.asocijacijeBind['B'] = this.asocijacijeFields['b'];
            this.asocijacijeBind['B1'] = this.asocijacijeFields['b1'];
            this.asocijacijeBind['B2'] = this.asocijacijeFields['b2'];
            this.asocijacijeBind['B3'] = this.asocijacijeFields['b3'];
            this.asocijacijeBind['B4'] = this.asocijacijeFields['b4'];
          }
          if (this.opponentSolvedColumns.includes('C')) {
            this.asocijacijeBind['C'] = this.asocijacijeFields['c'];
            this.asocijacijeBind['C1'] = this.asocijacijeFields['c1'];
            this.asocijacijeBind['C2'] = this.asocijacijeFields['c2'];
            this.asocijacijeBind['C3'] = this.asocijacijeFields['c3'];
            this.asocijacijeBind['C4'] = this.asocijacijeFields['c4'];
          }
          if (this.opponentSolvedColumns.includes('D')) {
            this.asocijacijeBind['D'] = this.asocijacijeFields['d'];
            this.asocijacijeBind['D1'] = this.asocijacijeFields['d1'];
            this.asocijacijeBind['D2'] = this.asocijacijeFields['d2'];
            this.asocijacijeBind['D3'] = this.asocijacijeFields['d3'];
            this.asocijacijeBind['D4'] = this.asocijacijeFields['d4'];
          }
          this.calcPointsOpponent();
          if (this.opponentSolvedColumns.includes('Final')) {
            if (!this.isFirstRoundSolved) {
              this.isFirstRoundSolved = true;
            }
            else {
              if (!this.isSecondRoundSolved) {
                this.isSecondRoundSolved = true;
              }
            }

            this.asocijacijeBind['Final'] = this.asocijacijeFields['final'];
            setTimeout(() => {
              this.resetAssocForMulti();
              if (this.userService.getCurrentUser().id == this.userService.getCurrentGame().player2Id) {
                this.frameService.hideLoader();
              }
              else {
                this.frameService.showLoader();
              }
              if (this.isSecondRoundSolved) {
                this.checkAsocijacijeAndCalculatePoints(true);
              }
            }, 5000);
          }
        }
      },
      error => {
        console.log(error);
      });
  }

  async getOpenedField() {
    let request = {
      gameId: this.userService.getCurrentGame().id,
      userId: this.userService.getCurrentUser().id,
    }
    await this.httpService.getOpenedField(request).subscribe(
      (res: any) => {
        this.asocijacijeBind[res.fieldName] = res.value;
      },
      error => {
        console.log(error);
      });
  }

  async getOnMove() {
    let request = {
      gameId: this.userService.getCurrentGame().id,
      userId: this.userService.getCurrentUser().id,
    }
    await this.httpService.onMove(request).subscribe(
      (res: any) => {
        if (this.userService.getCurrentUser().id == this.userService.getCurrentGame().player1Id) {
          if (res == 1) {
            this.frameService.hideLoader();
          }
          else {
            this.frameService.showLoader();
          }
        }
        else {
          if (res == 1) {
            this.frameService.showLoader();
          }
          else {
            this.frameService.hideLoader();
          }
        }
      },
      error => {
        console.log(error);
      });
  }

  closeMultiplayerDialog() {
    this.showMultiplayerDialog = false;
  }

  async createGame() {
    let request = {
      MultiplayerGameDate: this.formatDate(new Date()),
      Player1Id: this.userService.getCurrentUser().id
    }
    await this.httpService.createMultiplayerGame(request).subscribe(
      (res: any) => {
        this.connection
          .invoke('EnterFirst', res.id).then(
            (result: any) => {
              //console.log(res);
            }
          )
        this.userService.saveCurrentGame(res);
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

  async saveWord(isMultiPlayer: boolean = false) {
    if (isMultiPlayer) {
      this.frameService.showLoader();
      this.userService.saveSubmittedWord(this.wordSolution);
      let request = {
        gameId: this.userService.getCurrentGame().id,
        userId: this.userService.getCurrentUser().id,
        gameName: 'slagalica'
      }
      await this.httpService.playerFinished(request).subscribe(
        (res: any) => {
        },
        error => {
          console.log(error);
        });
    }
    else {
      await this.checkValidWordAndCalcPoints();
    }
  }

  async saveNum(isMultiPlayer: boolean = false) {
    if (isMultiPlayer) {
      this.frameService.showLoader();
      this.mojBrojPoints = 0;
      let calcResult = -1;
      try {
        calcResult = eval(this.expression);
      }
      catch (error) {

      }
      finally {
        this.userService.saveNumEval(calcResult);

        let request = {
          gameId: this.userService.getCurrentGame().id,
          userId: this.userService.getCurrentUser().id,
          evalResult: calcResult,
          gameName: 'mojbroj'
        }
        await this.httpService.playerFinished(request).subscribe(
          (res: any) => {
          },
          error => {
            console.log(error);
          });
      }
    }
    else {
      await this.checkValidExpressionAndCalcPoints();
    }
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

  async enterGame(gameId: any) {
    this.connection
      .invoke('EnterSecond', gameId).then(
        (res: any) => {
          //console.log(res);
        }
      )
    let request = {
      Id: gameId,
      Player2Id: this.userService.getCurrentUser().id
    }
    await this.httpService.getMultiplayerGame(request).subscribe(
      (res: any) => {
        this.userService.saveCurrentGame(res);
      },
      error => {
        this.waitCreateGame = 'Greška prilikom zapocinjanja igre, molimo pokušajte ponovo.'
        console.log(error);
      });
  }

  async openMultiplayerGamesDialog() {
    this.showMultiplayerGamesDialog = true;
    this.frameService.showLoader();
    this.getGames();
  }

  async getGames() {
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

  async getNums() {
    await this.httpService.getNums(this.userService.getCurrentGame()).subscribe(
      (res: any) => {
        this.numsArray = res.nums;
        this.finalNum = res.finalNum;
        this.frameService.hideLoader();
      },
      error => {
        this.frameService.hideLoader();
        console.log(error);
      });
  }

  async getCombination() {
    await this.httpService.getCombination(this.userService.getCurrentGame()).subscribe(
      (res: any) => {
        this.userService.saveCombination(res);
        //this.frameService.hideLoader();
      },
      error => {
        //this.frameService.hideLoader();
        console.log(error);
      });
  }

  async getChars() {
    await this.httpService.getChars(this.userService.getCurrentGame()).subscribe(
      (res: any) => {
        this.charsArray = res;
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

  async pickChars(isMultiplayer: boolean = false) {
    if (isMultiplayer) {
      this.wordGameTimeStarted = true;
      this.charsArray.forEach(char => {
        char.value = this.chars[Math.floor(Math.random() * 30) + 1 - 1]
      });
      let request = {
        multiplayerGameDto: this.userService.getCurrentGame(),
        chars: this.charsArray
      }
      await this.httpService.updateGameEndsDateAndSendChars(request).subscribe(
        (res: any) => {
        },
        error => {
          //this.waitCreateGame = 'Greška prilikom zapocinjanja igre, molimo pokušajte ponovo.'
          console.log(error);
        });
      this.startTimer(1, true);
    }
    else {
      this.wordGameTimeStarted = true;
      this.charsArray.forEach(char => {
        char.value = this.chars[Math.floor(Math.random() * 30) + 1 - 1]
      });
      this.startTimer(1);
    }

  }

  async pickSkocko(isMultiplayer: boolean = false) {
    this.skockoGameTimeStarted = true;
    this.skockoCombination[0] = this.skockoOptions[Math.floor(Math.random() * 6) + 1 - 1];
    this.skockoCombination[1] = this.skockoOptions[Math.floor(Math.random() * 6) + 1 - 1];
    this.skockoCombination[2] = this.skockoOptions[Math.floor(Math.random() * 6) + 1 - 1];
    this.skockoCombination[3] = this.skockoOptions[Math.floor(Math.random() * 6) + 1 - 1];
    if (isMultiplayer) {
      let request = {
        multiplayerGameDto: this.userService.getCurrentGame(),
        userId: this.userService.getCurrentUser().id,
        combination: this.skockoCombination
      }
      await this.httpService.updateGameEndsDateAndSendCombination(request).subscribe(
        (res: any) => {
        },
        error => {
          //this.waitCreateGame = 'Greška prilikom zapocinjanja igre, molimo pokušajte ponovo.'
          console.log(error);
        });
      this.startTimer(3, true);
    }
    else {
      this.startTimer(3);
    }
  }

  async pickAsocijacije(isMultiplayer: boolean = false) {
    if (isMultiplayer) {
      let request = {
        gameId: this.userService.getCurrentGame().id,
        userId: this.userService.getCurrentUser().id,
        shouldUpdateSpojniceGamePoints: !this.isFirstRoundSolved
      }
      await this.httpService.updateGameEndsDateAndNotifyForAssoc(request).subscribe(
        (res: any) => {
        },
        error => {
          //this.waitCreateGame = 'Greška prilikom zapocinjanja igre, molimo pokušajte ponovo.'
          console.log(error);
        });
      //this.startTimer(5, true);
    }
    else {
      this.asocijacijeGameStarted = true;
      this.startTimer(5);
    }
  }

  async getSpojniceAlreadyChecked() {
    let request = {
      multiplayerGameDto: this.userService.getCurrentGame(),
      userId: this.userService.getCurrentUser().id
    }
    await this.httpService.getSpojniceChecked(request).subscribe(
      (res: any) => {
        this.spojniceShuffledParovi = res.spojniceShuffledState;
        this.spojniceParovi = res.spojniceLeftSide
        this.currentRow = this.spojniceParovi.indexOf(this.spojniceParovi.find(x => x.correct == false))
      },
      error => {
        //this.waitCreateGame = 'Greška prilikom zapocinjanja igre, molimo pokušajte ponovo.'
        console.log(error);
      });
  }

  async getAssoc(isSecondRoundAssoc: boolean = false) {
    if (isSecondRoundAssoc) {
      this.userService.saveSpojniceGameState(6);
    }
    else {
      this.userService.saveSpojniceGameState(5);
    }
    let today = new Date();
    let date = isSecondRoundAssoc ? new Date(today.setDate(today.getDate() + 1)) : today;
    let request = {
      DailyGameDate: this.formatDate(date)
    }
    await this.httpService.getAssocGame(request).subscribe(
      (res: any) => {
        this.asocijacijeFields = res.associations;
        //this.userService.saveSpojniceGameState(res.gameState);
      },
      error => {
        console.log(error);
      });
  }

  async getSpojnice(isSecondRoundSpojnice: boolean = false) {
    let today = new Date();
    let date = isSecondRoundSpojnice ? new Date(today.setDate(today.getDate() + 1)) : today;
    let request = {
      DailyGameDate: this.formatDate(date)
    }
    await this.httpService.getSpojniceGame(request).subscribe(
      (res: any) => {
        //this.asocijacijeFields = res.associations;
        this.spojniceDesc = res.connections.description;
        let gameState = isSecondRoundSpojnice ? 3 : 1;
        this.userService.saveSpojniceGameState(gameState);
        let i = 0;
        let assignedIndexes = [];
        res.connections.pairs.forEach(pair => {
          this.spojniceParovi[i].left = pair.left;
          this.spojniceParovi[i].right = pair.right;
          this.spojniceParovi[i].correct = false;
          this.spojniceShuffledParovi[i].left = pair.left;
          this.spojniceShuffledParovi[i].correct = false;
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
  }

  async pickSpojnice(isMultiplayer: boolean = false) {
    if (isMultiplayer) {
      let request = {
        multiplayerGameDto: this.userService.getCurrentGame(),
        userId: this.userService.getCurrentUser().id
      }
      await this.httpService.updateGameEndsDateAndNotifyForConnections(request).subscribe(
        (res: any) => {
        },
        error => {
          //this.waitCreateGame = 'Greška prilikom zapocinjanja igre, molimo pokušajte ponovo.'
          console.log(error);
        });
    }
    else {
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
  }

  async openField(fieldName: string, isMultiplayer: boolean = false) {
    if (isMultiplayer && !this.oneFieldOpened) {
      let fieldNameLowerCaseFirst = fieldName[0].toLowerCase() + fieldName.slice(1);
      this.asocijacijeBind[fieldName] = this.asocijacijeFields[fieldNameLowerCaseFirst];
      this.oneFieldOpened = true;
      let request = {
        gameId: this.userService.getCurrentGame().id,
        userId: this.userService.getCurrentUser().id,
        fieldName: fieldName,
        value: this.asocijacijeFields[fieldNameLowerCaseFirst]
      }
      await this.httpService.sendOpenFieldNotification(request).subscribe(
        (res: any) => {
        },
        error => {
          //this.frameService.hideLoader();
          console.log(error);
        });
    }
    else if (this.asocijacijeGameStarted) {
      let fieldNameLowerCaseFirst = fieldName[0].toLowerCase() + fieldName.slice(1);
      this.asocijacijeBind[fieldName] = this.asocijacijeFields[fieldNameLowerCaseFirst];
    }
  }

  async submitFieldSolution(event: any, value: string, fieldName: string, isMultiplayer: boolean = false) {
    if (event.keyCode === 13) {
      if (isMultiplayer) {
        let fieldNameLowerCaseFirst = fieldName[0].toLowerCase() + fieldName.slice(1);
        let solutionWords = this.asocijacijeFields[fieldNameLowerCaseFirst].split(',').map(v => v.toLowerCase());;
        let valueTrimmed = value.trim();
        if (solutionWords.includes(valueTrimmed.toLowerCase())) {
          if (fieldName == 'Final') {
            this.isFinalSolved = true;
            this.finalSolAsocijacijePoints += 10;
            let countUnsolvedGroups = 0;
            if (this.asocijacijeBind['A'] == '') {
              countUnsolvedGroups++;
              this.solvedColumns.push('A');
            }
            if (this.asocijacijeBind['B'] == '') {
              countUnsolvedGroups++;
              this.solvedColumns.push('B');
            }
            if (this.asocijacijeBind['C'] == '') {
              countUnsolvedGroups++;
              this.solvedColumns.push('C');
            }
            if (this.asocijacijeBind['D'] == '') {
              countUnsolvedGroups++;
              this.solvedColumns.push('D');
            }

            if (countUnsolvedGroups > 0) {
              this.finalSolAsocijacijePoints += countUnsolvedGroups * 5;
            }

            this.populateAllFields();
            this.solvedColumns.push('Final');
            this.savePoints(this.finalSolAsocijacijePoints);
            this.finalSolAsocijacijePoints = 0;
            this.notifyOpponentForPointsAndSendSolutions();
            this.calcPointsOpponent();
          }
          else if (fieldName == 'A') {
            this.asocijacijePoints += 5;
            this.asocijacijeBind['A'] = this.asocijacijeFields['a'];
            this.asocijacijeBind['A1'] = this.asocijacijeFields['a1'];
            this.asocijacijeBind['A2'] = this.asocijacijeFields['a2'];
            this.asocijacijeBind['A3'] = this.asocijacijeFields['a3'];
            this.asocijacijeBind['A4'] = this.asocijacijeFields['a4'];
            this.solvedColumns.push('A');
            this.savePoints(5);
            this.notifyOpponentForPointsAndSendSolutions();
            this.colApoints = 5;
            this.points += this.colApoints;
          }
          else if (fieldName == 'B') {
            this.asocijacijePoints += 5;
            this.asocijacijeBind['B'] = this.asocijacijeFields['b'];
            this.asocijacijeBind['B1'] = this.asocijacijeFields['b1'];
            this.asocijacijeBind['B2'] = this.asocijacijeFields['b2'];
            this.asocijacijeBind['B3'] = this.asocijacijeFields['b3'];
            this.asocijacijeBind['B4'] = this.asocijacijeFields['b4'];
            this.solvedColumns.push('B');
            this.savePoints(5);
            this.notifyOpponentForPointsAndSendSolutions();
            this.colBpoints = 5;
            this.points += this.colBpoints;
          }
          else if (fieldName == 'C') {
            this.asocijacijePoints += 5;
            this.asocijacijeBind['C'] = this.asocijacijeFields['c'];
            this.asocijacijeBind['C1'] = this.asocijacijeFields['c1'];
            this.asocijacijeBind['C2'] = this.asocijacijeFields['c2'];
            this.asocijacijeBind['C3'] = this.asocijacijeFields['c3'];
            this.asocijacijeBind['C4'] = this.asocijacijeFields['c4'];
            this.solvedColumns.push('C');
            this.savePoints(5);
            this.notifyOpponentForPointsAndSendSolutions();
            this.colCpoints = 5;
            this.points += this.colCpoints;
          }
          else if (fieldName == 'D') {
            this.asocijacijePoints += 5;
            this.asocijacijeBind['D'] = this.asocijacijeFields['d'];
            this.asocijacijeBind['D1'] = this.asocijacijeFields['d1'];
            this.asocijacijeBind['D2'] = this.asocijacijeFields['d2'];
            this.asocijacijeBind['D3'] = this.asocijacijeFields['d3'];
            this.asocijacijeBind['D4'] = this.asocijacijeFields['d4'];
            this.solvedColumns.push('D');
            this.savePoints(5);
            this.notifyOpponentForPointsAndSendSolutions();
            this.colDpoints = 5;
            this.points += this.colDpoints;
          }
        }
        else {
          this.asocijacijeBind[fieldName] = '';
          this.frameService.showToastPrime('Netačno', 'Vaša asocijacija nije tačna', 'error', 2000);
          this.oneFieldOpened = false;
          let request = {
            gameId: this.userService.getCurrentGame().id,
            userId: this.userService.getCurrentUser().id
          }
          await this.httpService.nextPlayerAssoc(request).subscribe(
            (res: any) => {
            },
            error => {
              //this.frameService.hideLoader();
              console.log(error);
            });
        }
      }
      else {
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
  }

  async notifyOpponentForPointsAndSendSolutions() {
    let request = {
      gameId: this.userService.getCurrentGame().id,
      userId: this.userService.getCurrentUser().id,
      solvedCols: this.solvedColumns,
      isFinalSolved: this.isFinalSolved
    }
    if (this.isFinalSolved) {
      if (!this.isFirstRoundSolved) {
        this.isFirstRoundSolved = true;
        this.userService.saveSpojniceGameState(6);
      }
      else {
        if (!this.isSecondRoundSolved) {
          this.isSecondRoundSolved = true;
        }
      }
    }
    await this.httpService.notifyOpponentAndSendSolved(request).subscribe(
      (res: any) => {
      },
      error => {
        //this.frameService.hideLoader();
        console.log(error);
      });
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

  submitRowCombination(isMultiplayer: boolean = false) {
    let correctSignAndPlace = 0;
    let correctSign = 0;
    let i = 0;
    console.log(this.skockoCombination);
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
      if (isMultiplayer) {
        if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
          this.points += 10;
          this.infoMsg = "Pogodak! Osvojili ste 10 poena u ovoj igri.";
          this.savePoints(10);
          clearInterval(this.interval);
          this.timeLeftMultiplayer = 60;
          setTimeout(() => {
            this.moveNextGame();
            this.skockoActive = false;
            this.spojniceActive = true;
            this.infoMsg = '';
          }, 5000);
        }
        else {
          this.points += 10;
          this.infoMsg = "Pogodak! Osvojili ste 10 poena u ovoj igri.";
          this.savePoints(10);
          clearInterval(this.interval);
          this.timeLeftMultiplayer = 60;
          setTimeout(() => {
            this.moveNextPlayer();
            // this.skockoActive = false;
            // this.spojniceActive = true;
            // this.infoMsg = '';
          }, 5000);
        }
      }
      else {
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

    }
    else if (this.currentCombinationRow > 5) {
      if (isMultiplayer) {
        this.checkSkockoCombinationAndCalculatePoints(true);
      }
      else {
        this.checkSkockoCombinationAndCalculatePoints();
      }
    }
  }

  async moveNextGame() {
    this.frameService.showLoader();
    let request = {
      gameId: this.userService.getCurrentGame().id,
    }
    await this.httpService.nextGame(request).subscribe(
      (res: any) => {
      },
      error => {
        //this.frameService.hideLoader();
        console.log(error);
      });
  }

  async moveNextPlayer() {
    this.frameService.showLoader();
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
    this.skockoCombination = [];
    let request = {
      gameId: this.userService.getCurrentGame().id,
      userId: this.userService.getCurrentUser().id
    }
    await this.httpService.nextPlayer(request).subscribe(
      (res: any) => {
      },
      error => {
        //this.frameService.hideLoader();
        console.log(error);
      });
  }

  async pickNums(isMultiplayer: boolean = false) {
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
    if (isMultiplayer) {
      let request = {
        multiplayerGameDto: this.userService.getCurrentGame(),
        nums: this.numsArray,
        finalNum: this.finalNum
      }
      await this.httpService.updateGameEndsDateAndSendNums(request).subscribe(
        (res: any) => {
        },
        error => {
          //this.waitCreateGame = 'Greška prilikom zapocinjanja igre, molimo pokušajte ponovo.'
          console.log(error);
        });
      this.startTimer(2, true);
    }
    else {
      this.startTimer(2);
    }
  }

  startTimerPassive() {
    this.interval = setInterval(async () => {
      if (this.timeLeftMultiplayer > 0) {
        this.httpService.getSecondsLeft(this.userService.getCurrentGame()).subscribe(
          (res: any) => {
            this.timeLeftMultiplayer = res;
          },
          error => {
            console.log(error);
          });
      }
      else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  startTimer(game: number, isMultiPlayer = false) {
    if (isMultiPlayer) {
      this.interval = setInterval(async () => {
        if (this.timeLeftMultiplayer > 0) {
          this.httpService.getSecondsLeft(this.userService.getCurrentGame()).subscribe(
            (res: any) => {
              this.timeLeftMultiplayer = res;
            },
            error => {
              console.log(error);
            });
        } else {
          clearInterval(this.interval);
          if (game == 1) {
            if (isMultiPlayer) {
              await this.checkValidWordAndCalcPoints(true);
            }
            else {
              await this.checkValidWordAndCalcPoints();
            }
          }
          else if (game == 2) {
            if (isMultiPlayer) {
              await this.saveNum(true);
            }
            else {
              await this.checkValidExpressionAndCalcPoints();
            }
          }
          else if (game == 3) {
            if (isMultiPlayer) {
              this.checkSkockoCombinationAndCalculatePoints(true);
            }
            else {
              this.checkSkockoCombinationAndCalculatePoints();
            }
          }
          else if (game == 4) {
            if (isMultiPlayer) {
              this.checkSpojniceAndCalculatePoints(true);
            }
            else {
              this.checkSpojniceAndCalculatePoints();
            }
          }
          else if (game == 5) {
            if (isMultiPlayer) {
              this.handleAssocTimesUp();
            }
            else {
              this.checkAsocijacijeAndCalculatePoints();
            }
          }
        }
      }, 1000)
    }
    else {
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
  }

  checkConnection(index: number, isMultiplayer: boolean = false) {
    let state = this.userService.getSpojniceGameState();
    if (this.spojniceShuffledParovi[index].correct == false) {
      if (this.spojniceShuffledParovi[index].right == this.spojniceParovi[this.currentRow].right) {
        this.spojniceParovi[this.currentRow].correct = true;
        this.spojniceShuffledParovi[index].correct = true;
        this.spojnicePoints += 1;
      }

      if (this.currentRow == 9) {
        if (isMultiplayer) {
          if (state != 2 && state != 4) {
            this.checkSpojniceAndCalculatePoints(true);
          }
        }
        else {
          this.checkSpojniceAndCalculatePoints();
        }
      }

      if (isMultiplayer && (state == 2 || state == 4)) {
        let spojniceParoviNew = this.spojniceParovi.slice(this.currentRow + 1);
        let elem = spojniceParoviNew.find(x => x.correct == false);
        if (elem) {
          this.currentRow = this.spojniceParovi.indexOf(elem);
        }
        else {
          //this.currentRow = 0;
          this.checkSpojniceAndCalculatePoints(true);
        }
      }
      else {
        this.currentRow++;
      }

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

  async checkValidWordAndCalcPoints(isMultiplayer: boolean = false) {
    this.wordSolution = isMultiplayer ? this.userService.getSubmittedWord() : this.wordSolution;
    let wordRequest = {
      Rec: this.wordSolution, //'ЧИГОТА'
      GameId: this.userService.getCurrentGame()?.id,
      UserId: this.userService.getCurrentUser().id
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
          if (isMultiplayer) {
            this.timeLeftMultiplayer = 60;
            this.calcPointsOpponent();
            if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
              this.numGameTimeStarted = true;
              this.frameService.showLoader();
            }
          }
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
          if (isMultiplayer) {
            this.calcPointsOpponent();
            this.timeLeftMultiplayer = 60;
            if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
              this.numGameTimeStarted = true;
              this.frameService.showLoader();
            }
          }
          this.slagalicaActive = false;
          this.mojBrojActive = true;
          this.infoMsg = '';
        }, 5000);
        console.log(error);
      });
  }

  async getOpponentCalculation() {
    let request = {
      GameId: this.userService.getCurrentGame().id,
      UserId: this.userService.getCurrentUser().id
    }
    await this.httpService.getOpponentsCalcNumber(request).subscribe(
      (res: any) => {
        this.userService.saveOpponentCalcNumber(res);
        let myNumber = this.userService.getNumEval();
        let calcPoints = 0;
        if ((this.finalNum == myNumber && this.finalNum == res) || (Math.abs(this.finalNum - myNumber) == Math.abs(this.finalNum - res))) {
          calcPoints = 5;
          this.savePoints(calcPoints);
        }
        else if (Math.abs(this.finalNum - myNumber) < Math.abs(this.finalNum - res)) {
          calcPoints = 10;
          this.savePoints(calcPoints);
        }
        else {
          let a = 6;
        }
        this.infoMsg = `Osvojili ste ${calcPoints} poena u ovoj igri. Uskoro počinje sledeća igra...`;
        clearInterval(this.interval);
        this.timeLeftMultiplayer = 60;
        this.frameService.hideLoader();
        setTimeout(async () => {
          if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
            this.skockoGameTimeStarted = true;
            this.frameService.showLoader();
          }
          this.calcPointsOpponent();
          this.mojBrojActive = false;
          this.skockoActive = true;
          this.infoMsg = '';
        }, 5000);
      },
      error => {
        this.frameService.hideLoader();
        console.log(error);
      });
  }

  async calcPointsOpponent() {
    let request = {
      GameId: this.userService.getCurrentGame().id,
      UserId: this.userService.getCurrentUser().id
    }
    await this.httpService.calcOpponentPoints(request).subscribe(
      (res: any) => {
        this.points = res.points;
        this.pointsOpponent = res.opponentPoints;
        //this.frameService.hideLoader();
      },
      error => {
        //this.frameService.hideLoader();
        console.log(error);
      });
  }

  async checkValidExpressionAndCalcPoints(isMultiplayer: boolean = false) {
    try {
      this.mojBrojPoints = 0;
      //this.expression = isMultiplayer ? this.userService.getSubmittedExpression() : this.expression;
      let calcResult = eval(this.expression);
      if (Number.isInteger(calcResult)) {
        if (calcResult == this.finalNum) {
          this.mojBrojPoints = 10;
          this.points += this.mojBrojPoints;
        }
        else if ((calcResult - this.finalNum <= 5 && calcResult - this.finalNum >= -5)
          || (this.finalNum - calcResult <= 5 && this.finalNum - calcResult >= -5)) {
          this.mojBrojPoints = 5;
          this.points += this.mojBrojPoints;
        }
      }

      this.infoMsg = `Osvojili ste ${this.mojBrojPoints} poena u ovoj igri. Uskoro počinje sledeća igra...`
    }
    catch (error) {
      this.infoMsg = `Osvojili ste 0 poena u ovoj igri. Postoji greška u vašem izrazu. Uskoro počinje sledeća igra...`
    }
    finally {
      clearInterval(this.interval);
      this.timeLeft = 60;
      if (isMultiplayer) {
        this.timeLeftMultiplayer = 60;
        //this.savePoints(this.mojBrojPoints);
        //this.savePoints(10);
        this.calcPointsOpponent();
      }

      this.frameService.hideLoader();
      setTimeout(async () => {
        if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
          this.skockoGameTimeStarted = true;
          this.frameService.showLoader();
        }
        this.mojBrojActive = false;
        this.skockoActive = true;
        this.infoMsg = '';
      }, 5000);
    }
  }

  async savePoints(mojBrojPoints) {
    let request = {
      gameId: this.userService.getCurrentGame().id,
      userId: this.userService.getCurrentUser().id,
      addPoints: mojBrojPoints
    }
    await this.httpService.savePoints(request).subscribe(
      (res: any) => {
      },
      error => {
        console.log(error);
      });
  }

  checkSkockoCombinationAndCalculatePoints(isMultiplayer: boolean = false) {
    if (isMultiplayer) {
      this.infoMsg = `Osvojili ste 0 poena u ovoj igri.`;
      if (this.userService.getCurrentUser().id == this.userService.getCurrentGame()?.player2Id) {
        clearInterval(this.interval);
        this.timeLeftMultiplayer = 60;
        setTimeout(() => {
          this.moveNextGame();
          this.skockoActive = false;
          this.spojniceActive = true;
          this.infoMsg = '';
        }, 5000);
      }
      else {
        clearInterval(this.interval);
        this.timeLeftMultiplayer = 60;
        setTimeout(() => {
          this.moveNextPlayer();
        }, 5000);
      }
    }
    else {
      this.infoMsg = `Osvojili ste 0 poena u ovoj igri. Uskoro počinje sledeća igra...`;
      clearInterval(this.interval);
      this.timeLeft = 60;
      setTimeout(() => {
        this.skockoActive = false;
        this.spojniceActive = true;
        this.infoMsg = '';
      }, 5000);
    }
  }

  async checkSpojniceAndCalculatePoints(isMultiplayer: boolean = false) {
    if (isMultiplayer) {
      let gameState = this.userService.getSpojniceGameState();
      if (gameState == 1) {
        await this.savePoints(this.spojnicePoints);
        if (this.spojnicePoints == 10) {
          let request = {
            gameId: this.userService.getCurrentGame().id,
            userId: this.userService.getCurrentUser().id,
          }
          await this.httpService.spojniceSecondRound(request).subscribe(
            (res: any) => {
            },
            error => {
              console.log(error);
            });
        }
        else {
          let request = {
            multiplayerGameDto: this.userService.getCurrentGame(),
            userId: this.userService.getCurrentUser().id,
            spojniceShuffledState: this.spojniceShuffledParovi,
            spojniceLeftSide: this.spojniceParovi
          }
          await this.httpService.sendSpojniceShuffledState(request).subscribe(
            (res: any) => {
            },
            error => {
              console.log(error);
            });
        }
      }
      else if (gameState == 2) {
        await this.savePoints(this.spojnicePoints);
        this.spojnicePoints = 0; // PROVERI DAL SI I OVO OMANUO
        //notif za novu spojnicu
        let request = {
          gameId: this.userService.getCurrentGame().id,
          userId: this.userService.getCurrentUser().id,
        }
        await this.httpService.spojniceSecondRound(request).subscribe(
          (res: any) => {
          },
          error => {
            console.log(error);
          });

      }
      else if (gameState == 3) {
        await this.savePoints(this.spojnicePoints);
        if (this.spojnicePoints == 10) {
          let request = {
            gameId: this.userService.getCurrentGame().id,
            userId: this.userService.getCurrentUser().id,
          }
          await this.httpService.moveToAsoc(request).subscribe(
            (res: any) => {
            },
            error => {
              console.log(error);
            });
        }
        else {
          let request = {
            multiplayerGameDto: this.userService.getCurrentGame(),
            userId: this.userService.getCurrentUser().id,
            spojniceShuffledState: this.spojniceShuffledParovi,
            spojniceLeftSide: this.spojniceParovi
          }
          await this.httpService.sendSpojniceShuffledState(request).subscribe(
            (res: any) => {
            },
            error => {
              console.log(error);
            });
        }
      }
      else if (gameState == 4) {
        await this.savePoints(this.spojnicePoints);
        //notif za prelazak na asoc
        let request = {
          gameId: this.userService.getCurrentGame().id,
          userId: this.userService.getCurrentUser().id,
        }
        await this.httpService.moveToAsoc(request).subscribe(
          (res: any) => {
          },
          error => {
            console.log(error);
          });
      }
    }
    else {
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
  }

  async checkAsocijacijeAndCalculatePoints(isMultiplayer: boolean = false) {
    if (isMultiplayer) {
      clearInterval(this.interval);
      let request = {
        gameId: this.userService.getCurrentGame().id,
        userId: this.userService.getCurrentUser().id,
      }
      await this.httpService.getAllGamesPoints(request).subscribe(
        (res: any) => {
          this.player1SlagalicaPoints = res.player1SlagalicaPoints;
          this.player1MojBrojPoints = res.player1MojBrojPoints;
          this.player1SkockoPoints = res.player1SkockoPoints;
          this.player1SpojnicePoints = res.player1SpojnicePoints;
          this.player1AsocijacijePoints = res.player1AsocijacijePoints;

          this.player2SlagalicaPoints = res.player2SlagalicaPoints;
          this.player2MojBrojPoints = res.player2MojBrojPoints;
          this.player2SkockoPoints = res.player2SkockoPoints;
          this.player2SpojnicePoints = res.player2SpojnicePoints;
          this.player2AsocijacijePoints = res.player2AsocijacijePoints;
        },
        error => {
          console.log(error);
        });
      this.timeLeft = 60;
      setTimeout(() => {
        this.frameService.hideLoader();
        this.gameFinished = true;
        this.asocijacijeActive = false;
        this.infoMsg = '';
      }, 5000);
    }
    else {
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
