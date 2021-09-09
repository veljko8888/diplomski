import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SectionDto } from 'app/Models/models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../mock/users.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class HttpHandlerService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  readonly BaseURI = 'http://localhost:58701/api';
  readonly BaseURICut = 'http://localhost:58701/';

  login(loginRequest: any, httpClient: any){
    return httpClient.post(this.BaseURI + '/Authentication/Login', loginRequest);
  }

  register(registerRequest: any, httpClient: any) {
    return httpClient.post(this.BaseURI + '/Authentication/Register', registerRequest);
  }

  changePass(changePassRequest: any, httpClient: any) {
    return httpClient.post(this.BaseURI + '/Authentication/ChangePass', changePassRequest);
  }

  getUserProfile() {
    return this.http.get(this.BaseURI + '/User/UserProfile');
  }

  getAllUsers() {
    return this.http.get(this.BaseURI + '/Organization/users-administration');
  }

  getRankings(httpClient: HttpClient) {
    return httpClient.get(this.BaseURI + '/Authentication/best-users');
  }

  getDailyGamesForDate(dailyGameDate: any) {
    return this.http.post(this.BaseURI + '/Organization/daily-games', dailyGameDate);
  }

  addDailyGame(dailyGame: any) {
    return this.http.post(this.BaseURI + '/Organization/add-daily-game', dailyGame);
  }

  activateDeactivateUser(userRequest: any){
    return this.http.post(this.BaseURI + '/Organization/activate-deactivate', userRequest);
  }

  addWord(wordRequest: any) {
    return this.http.post(this.BaseURI + '/Organization/add-word', wordRequest);
  }

  addWordsUpload(wordsRequest: any) {
    return this.http.post(this.BaseURI + '/Organization/add-words-upload', wordsRequest);
  }

  addConnectionGame(connRequest: any) {
    return this.http.post(this.BaseURI + '/Organization/add-connection-game', connRequest);
  }

  addConnsUpload(connsRequest: any){
    return this.http.post(this.BaseURI + '/Organization/add-conns-games', connsRequest);
  }

  addAssocGame(assocRequest: any) {
    return this.http.post(this.BaseURI + '/Organization/add-assoc-game', assocRequest);
  }

  playerFinished(request: any){
    return this.http.post(this.BaseURI + '/Organization/player-finished', request);
  }

  checkValidWord(wordRequest: any) {
    return this.http.post(this.BaseURI + '/Organization/word-valid', wordRequest);
  }

  saveDailyGame(request: any){
    return this.http.post(this.BaseURI + '/Organization/save-daily-play', request);
  }

  getSecondsLeft(request: any){
    return this.http.post(this.BaseURI + '/Organization/get-seconds-left', request);
  }

  updateGameEndsDateAndSendCombination(request: any){
    return this.http.post(this.BaseURI + '/Organization/update-game-ends-combination', request);
  }

  updateGameEndsDateAndSendChars(request: any){
    return this.http.post(this.BaseURI + '/Organization/update-game-ends', request);
  }

  updateGameEndsDateAndSendNums(request: any){
    return this.http.post(this.BaseURI + '/Organization/update-game-ends-nums', request);
  }

  updateGameEndsDateAndNotifyForConnections(request: any){
    return this.http.post(this.BaseURI + '/Organization/update-game-ends-connections', request);
  }

  getSpojniceGame(currentDate){
    return this.http.post(this.BaseURI + '/Organization/get-spojnice', currentDate);
  }

  getSpojniceChecked(request: any){
    return this.http.post(this.BaseURI + '/Organization/get-spojnice-checked', request);
  }

  getDailyGame(currentDate: any) {
    return this.http.post(this.BaseURI + '/Organization/get-daily-game', currentDate);
  }

  createMultiplayerGame(request: any){
    return this.http.post(this.BaseURI + '/Organization/create-multiplayer-game', request);
  }

  getMultiplayerGame(request: any){
    return this.http.post(this.BaseURI + '/Organization/get-multiplayer-game', request);
  }

  getMultiplayerGames(){
    return this.http.get(this.BaseURI + '/Organization/multiplayer-games');
  }

  calcOpponentPoints(request: any){
    return this.http.post(this.BaseURI + '/Organization/opponent-points', request);
  }

  getOpponentsCalcNumber(request: any){
    return this.http.post(this.BaseURI + '/Organization/opponent-calcnum', request);
  }

  getCombination(request: any){
    return this.http.post(this.BaseURI + '/Organization/get-combination', request);
  }

  getChars(request: any){
    return this.http.post(this.BaseURI + '/Organization/get-chars', request);
  }

  getNums(request: any){
    return this.http.post(this.BaseURI + '/Organization/get-nums', request);
  }

  nextPlayer(request: any){
    return this.http.post(this.BaseURI + '/Organization/next-player', request);
  }

  tryOtherPlayer(request: any){
    return this.http.post(this.BaseURI + '/Organization/try-next-player', request);
  }

  nextGame(request: any){
    return this.http.post(this.BaseURI + '/Organization/next-game', request);
  }

  savePoints(request: any){
    return this.http.post(this.BaseURI + '/Organization/save-points', request);
  }

  spojniceSecondRound(request: any){
    return this.http.post(this.BaseURI + '/Organization/spojnice-second-round', request);
  }

  sendSpojniceShuffledState(request: any){
    return this.http.post(this.BaseURI + '/Organization/spojnice-save-shuffled', request);
  }

  moveToAsoc(request: any){
    return this.http.post(this.BaseURI + '/Organization/move-to-asoc', request);
  }

  addAssocsUpload(assocsRequest: any) {
    return this.http.post(this.BaseURI + '/Organization/add-assocs-games', assocsRequest);
  }

  uploadProfilePicture(profPictureRequest: any) {
    return this.http.post(this.BaseURI + '/Authentication/upload-image', profPictureRequest);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
