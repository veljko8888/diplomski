import { of as observableOf,  Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Contacts, RecentUsers, UserData } from '../data/users';

@Injectable()
export class UserService extends UserData {

  private time: Date = new Date;

  private currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
  public readonly currentUser$: Observable<any> = this.currentUser.asObservable();

  private currentGame: BehaviorSubject<any> = new BehaviorSubject(null);
  public readonly currentGame$: Observable<any> = this.currentGame.asObservable();

  private submittedWord: BehaviorSubject<any> = new BehaviorSubject(null);
  public readonly submittedWord$: Observable<any> = this.submittedWord.asObservable();

  private submittedNum: BehaviorSubject<any> = new BehaviorSubject(null);
  public readonly submittedNum$: Observable<any> = this.submittedNum.asObservable();

  private skockoCombination: BehaviorSubject<any> = new BehaviorSubject(null);
  public readonly skockoCombination$: Observable<any> = this.skockoCombination.asObservable();

  private opponentCalcNum: BehaviorSubject<any> = new BehaviorSubject(null);
  public readonly opponentCalcNum$: Observable<any> = this.opponentCalcNum.asObservable();

  private users = {
    nick: { name: 'Nick Jones', picture: 'assets/images/nick.png' },
    eva: { name: 'Eva Moor', picture: 'assets/images/eva.png' },
    jack: { name: 'Jack Williams', picture: 'assets/images/jack.png' },
    lee: { name: 'Lee Wong', picture: 'assets/images/lee.png' },
    alan: { name: 'Alan Thompson', picture: 'assets/images/alan.png' },
    kate: { name: 'Kate Martinez', picture: 'assets/images/kate.png' },
  };
  private types = {
    mobile: 'mobile',
    home: 'home',
    work: 'work',
  };
  private contacts: Contacts[] = [
    { user: this.users.nick, type: this.types.mobile },
    { user: this.users.eva, type: this.types.home },
    { user: this.users.jack, type: this.types.mobile },
    { user: this.users.lee, type: this.types.mobile },
    { user: this.users.alan, type: this.types.home },
    { user: this.users.kate, type: this.types.work },
  ];
  private recentUsers: RecentUsers[]  = [
    { user: this.users.alan, type: this.types.home, time: this.time.setHours(21, 12)},
    { user: this.users.eva, type: this.types.home, time: this.time.setHours(17, 45)},
    { user: this.users.nick, type: this.types.mobile, time: this.time.setHours(5, 29)},
    { user: this.users.lee, type: this.types.mobile, time: this.time.setHours(11, 24)},
    { user: this.users.jack, type: this.types.mobile, time: this.time.setHours(10, 45)},
    { user: this.users.kate, type: this.types.work, time: this.time.setHours(9, 42)},
    { user: this.users.kate, type: this.types.work, time: this.time.setHours(9, 31)},
    { user: this.users.jack, type: this.types.mobile, time: this.time.setHours(8, 0)},
  ];

  saveOpponentCalcNumber(num: any){
    this.opponentCalcNum.next(num);
  }

  getOpponentCalcNumber(){
    return this.opponentCalcNum.value;
  }

  saveCombination(comb: any){
    this.skockoCombination.next(comb);
  }

  getCombination(){
    return this.skockoCombination.value;
  }

  saveNumEval(numSolution: any) {
    this.submittedNum.next(numSolution);
  }

  getNumEval(){
    return this.submittedNum.value;
  }

  saveSubmittedWord(wordSolution: string){
    this.submittedWord.next(wordSolution);
  }

  getSubmittedWord(){
    return this.submittedWord.value;
  }

  saveCurrentGame(currentGameForFirstPlayer: any){
    this.currentGame.next(currentGameForFirstPlayer);
  }

  getCurrentGame(){
    return this.currentGame.value;
  }

  saveLoggedInUser(loggedInUser) {
    this.currentUser.next(loggedInUser);
  }

  getCurrentUser(){
    return this.currentUser.value;
  }

  getUsers(): Observable<any> {
    return observableOf(this.users);
  }

  getContacts(): Observable<Contacts[]> {
    return observableOf(this.contacts);
  }

  getRecentUsers(): Observable<RecentUsers[]> {
    return observableOf(this.recentUsers);
  }
}
