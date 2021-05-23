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
  readonly JPApiBaseURI = 'https://demo.mypermitnow.org/api';
  readonly JPAPINewBaseURI = 'https://api.mgoconnect.org';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('mgoapiadmin@mgo.org:2}f(vVL8eR;29Zv@eGv!!,~')
    })
  };
  

  getLoggedInUserID(){
    //https://api.mgoconnect.org/cognitouser/efc38e8b-3421-42e4-a695-a5cbf721b618
    var loggedInuserURL = this.JPAPINewBaseURI + `/jpv2/user/${this.userService.getCurrentUser().UserID}`;
    return this.http.get(loggedInuserURL, this.httpOptions);
  }

  getLoggedInUser(cognitoUserId: string){
    //https://api.mgoconnect.org/cognitouser/efc38e8b-3421-42e4-a695-a5cbf721b618
    var loggedInuserURL = this.JPAPINewBaseURI + `/cognitouser/${cognitoUserId}`;
    return this.http.get(loggedInuserURL, this.httpOptions);
  }

  getWorkOrder(workOrderId: any){
    //https://api.mgoconnect.org/jpv2/workorders/{workorderid}/info 
    //https://api.mgoconnect.org/jpv2/workorders/{workorderid}/allinfo
    var workOrderInfoURL = this.JPAPINewBaseURI + `/jpv2/workorders/${workOrderId}/allinfo`;
    return this.http.get(workOrderInfoURL, this.httpOptions);
  }

  updateWorkOrder(woObj: any, workOrderId: any){
    //POST /jpv2/workorders/{workorderID}/update
    var updateWorkOrderURL = this.JPAPINewBaseURI + '/jpv2/workorders/' + workOrderId + '/update';
    return this.http.post<any>(updateWorkOrderURL, woObj, this.httpOptions);
  }

  saveInspection(inspectionObj: any){
    //POST https://api.mgoconnect.org/jpv2/inspections/createchecklist
    var saveInspectionURL = this.JPAPINewBaseURI + '/jpv2/inspections/createchecklist';
    return this.http.post<any>(saveInspectionURL, inspectionObj, this.httpOptions);
  }

  searchWorkDetails(dateFrom: string, dateTo: string){
    //https://api.mgoconnect.org/jpv2/workorders/user/10?Start=2020-10-01&End=2020-10-10
    var myWorkOrdersURL = this.JPAPINewBaseURI + `/jpv2/workorders/user/${this.userService.getCurrentUser().UserID}?Start=${dateFrom}&End=${dateTo}`;
    return this.http.get(myWorkOrdersURL, this.httpOptions);
  }

  quickSearchProjects(searchText: string){
    //https://api.mgoconnct.org/jpv2/project/quicksearch?UserID={UserID}&Term={Term}
    var quickSearchProjectsURL = this.JPAPINewBaseURI + `/jpv2/project/quicksearch?UserID=${this.userService.getCurrentUser().UserID}&Term=${searchText}`;
    return this.http.get(quickSearchProjectsURL, this.httpOptions);
  }

  getJurisdictions(){
    //temporary userID = 128
    var jurisdictionsURL = this.JPAPINewBaseURI + `/jpv2/user/${this.userService.getCurrentUser().UserID}/jurisdictions`;
    return this.http.get(jurisdictionsURL, this.httpOptions);
  }

  getSepticJurisdictions(){
    //temporary userID = 128
    var jurisdictionsURL = this.JPAPINewBaseURI + `/jpv2/septic/jurisdictions/${this.userService.getCurrentUser().UserID}`;
    return this.http.get(jurisdictionsURL, this.httpOptions);
  }

  getProjectTypes(jurisdictionID: number){
    //temporary userID = 128
    var projectTypesURL = this.JPAPINewBaseURI + `/jpv2/user/${this.userService.getCurrentUser().UserID}/projecttypes/` + jurisdictionID;
    return this.http.get(projectTypesURL, this.httpOptions);
  }

  getDepartmentsForJurisdiction(jurisdictionID: number){
    //temporary userID = 128
    var departmentsURL = this.JPAPINewBaseURI + `/jpv2/jurisdiction/${jurisdictionID}/departments`;
    return this.http.get(departmentsURL, this.httpOptions);
  }

  getProjectSettings(jurisdictionID: number, projectTypeID: number){
    //temporary userID = 128
    var jurisdictionsURL = this.JPAPINewBaseURI + '/jpv2/jurisdiction/' + jurisdictionID + '/createsettings/' + projectTypeID;
    return this.http.get(jurisdictionsURL, this.httpOptions);
  }

  getChecklists(permitID: number) {
    var checklistsURL = this.JPAPINewBaseURI + '/jpv2/projectchecklists/' + permitID;
    return this.http.get(checklistsURL, this.httpOptions);
  }

  getUserCustomReports() {
    var reportsURL = this.JPAPINewBaseURI + `/jpv2/reports/${this.userService.getCurrentUser().UserID}`;
    return this.http.get(reportsURL, this.httpOptions);
  }

  saveUserReportPreferences(reportData: any) {
    var reportsURL = this.JPAPINewBaseURI + `/jpv2/reports/${this.userService.getCurrentUser().UserID}`;
    return this.http.post<any>(reportsURL, reportData, this.httpOptions);
  }

  saveUserReportCategory(categoryData: any) {
    var reportsURL = this.JPAPINewBaseURI + `/jpv2/reports/${this.userService.getCurrentUser().UserID}/categories`;
    return this.http.post<any>(reportsURL, categoryData, this.httpOptions);
  }

  deleteUserReportCategory(categoryId: number) {
    var reportsURL = this.JPAPINewBaseURI + `/jpv2/reports/${this.userService.getCurrentUser().UserID}/categories/${categoryId}`;
    return this.http.delete<any>(reportsURL, this.httpOptions);
  }

  saveChecklists(checklistsData: any, permitID: number): Observable<any> {
    var saveChecklistsURL = this.JPAPINewBaseURI + '/jpv2/projectchecklists/' + permitID;
    return this.http.post<any>(saveChecklistsURL, checklistsData, this.httpOptions);
      // .pipe(
      //   catchError(this.handleError)
      // );
  }

  saveProject(project: any){
    var saveProjectURL = this.JPAPINewBaseURI + '/jpv2/project/create';
    return this.http.post<any>(saveProjectURL, project, this.httpOptions);
  }

  removeTabSection(permitID: number, sectionID: number){
    var removeTabSectionURL = this.JPAPINewBaseURI + '/jpv2/projectchecklists/' + permitID + '/' + sectionID;
    return this.http.delete<any>(removeTabSectionURL, this.httpOptions);
  }

  searchSepticContracts(jurisdictionID: number, projectNo: string, address: string){
    //temporary userID = 128
    //https://api.mgoconnect.org/jpv2/workorders/user/10?Start=2020-10-01&End=2020-10-10
    var searchSepticURL = this.JPAPINewBaseURI + `/jpv2/septic/search?UserID=${this.userService.getCurrentUser().UserID}&ProjNo=${projectNo}&Address=${address}&JID=${jurisdictionID}`;
    return this.http.get(searchSepticURL, this.httpOptions);
  }

  getSepticContractInfo(permitID: number, contractID: number){
    //temporary userID = 128
    //https://api.mgoconnect.org/jpv2/workorders/user/10?Start=2020-10-01&End=2020-10-10
    var getSepticURL = this.JPAPINewBaseURI + `/jpv2/septic/${permitID}/${contractID}`;
    return this.http.get(getSepticURL, this.httpOptions);
  }

  saveSepticInspection(inspection: any){
    var saveSepticURL = this.JPAPINewBaseURI + `/jpv2/septic/inspections`;
    return this.http.post<any>(saveSepticURL, inspection, this.httpOptions);
  }

  uploadFile(file: any){
    var uploadFileURL = this.JPAPINewBaseURI + `/jpv2/files`;
    return this.http.post<any>(uploadFileURL, file, this.httpOptions);
  }

  getShareUsers(){
    var shareURL = this.JPAPINewBaseURI + `/jpv2/projectmanager/share/${this.userService.getCurrentUser().UserID}`;
    return <Observable<any[]>>this.http.get(shareURL, this.httpOptions);
  }

  getProjectRequirements(projectId: number, priority: number = null){
    var shareURL = this.JPAPINewBaseURI + `/jpv2/project/${projectId}/requirements?priority=${priority}`
    return <Observable<any[]>>this.http.get(shareURL, this.httpOptions);
  }
  
  getProjectResponsibleUsers(permitID: number){
    var getSettingsURL = this.JPAPINewBaseURI + `/jpv2/projectmanager/project/${permitID}/responsibleusers`;
    return this.http.get(getSettingsURL, this.httpOptions);
  }

  getProjectManagerSearchSettings(jID: number, ptID: number){
    var getSettingsURL = this.JPAPINewBaseURI + `/jpv2/jurisdiction/${jID}/pmsearchsettings/${ptID} `;
    return this.http.get(getSettingsURL, this.httpOptions);
  }

  fetchReqStatusHistory(ptrxid: number){
    var getHistoryURL = this.JPAPINewBaseURI + `/jpv2/requirements/${ptrxid}/statushistory`;
    return this.http.get(getHistoryURL, this.httpOptions);
  }

  fetchReqFiles(ptrxid: number){
    var getFilesURL = this.JPAPINewBaseURI + `/jpv2/requirements/${ptrxid}/files`;
    return this.http.get(getFilesURL, this.httpOptions);
  }

  getProjectManagerSearch(model){
    const params = new HttpParams()
    .set('UserID', this.userService.getCurrentUser().UserID)
    .set('JID', model.JID.toString())
    .set('PTID', !!model.PTID ? model.PTID.toString() : '')
    .set('ProjName', !!model.ProjName ? model.ProjName.toString() : '')
    .set('PermitNo', !!model.ProjectNumber ? model.ProjectNumber.toString() : '')
    .set('Parcel', !!model.Parcel ? model.Parcel.toString() : '')
    .set('Designation', !!model.Designation ? model.Designation.toString() : '')
    .set('WorkType', !!model.WorkType ? model.WorkType.toString() : '')
    .set('Assigned', !!model.Assigned ? model.Assigned.toString() : '')
    .set('CreateStart', !!model.CreateStart ? moment.utc(model.CreateStart).format() : '')
    .set('CreateEnd', !!model.CreateEnd ? moment.utc(model.CreateEnd).format() : '')
    .set('ScheduleStart', !!model.ScheduleStart ? moment.utc(model.ScheduleStart).format() : '')
    .set('ScheduleEnd', !!model.ScheduleEnd ? moment.utc(model.ScheduleEnd).format() : '')
    .set('Subdivision', !!model.Subdivision ? model.Subdivision.toString() : '')
    .set('Lot', !!model.Lot ? model.Lot.toString() : '')
    .set('Status', !!model.Status ? model.Status.toString() : '-1')
    .set('Address', !!model.Address ? model.Address.toString() : '');
  
    var projManagerSearchURL = this.JPAPINewBaseURI + `/jpv2/projectmanager/search`;
    return this.http.get(projManagerSearchURL, {headers: this.httpOptions.headers, params});
  }

  getProjectManagerPreferences(){
    var userPrefURL = this.JPAPINewBaseURI + `/jpv2/projectmanager/preferences/${this.userService.getCurrentUser().UserID}`;
    return this.http.get(userPrefURL, this.httpOptions);
  }

  saveProjectManagerPreferences(preferences: any){
    var userPrefURL = this.JPAPINewBaseURI + `/jpv2/projectmanager/preferences/${this.userService.getCurrentUser().UserID}`;
    return this.http.post(userPrefURL,preferences, this.httpOptions);
  }

  getScheduleSets(){
    var getSetURL = this.JPAPINewBaseURI + `/jpv2/projectmanager/user/${this.userService.getCurrentUser().UserID}`;
    return <Observable<any[]>>this.http.get(getSetURL, this.httpOptions);
  }

  updateScheduleSet(set: any[]){
    set.forEach(s => {
      s.UserID = this.userService.getCurrentUser().UserID;
    });
    var updateSetURL = this.JPAPINewBaseURI + `/jpv2/projectmanager/updateset`;
    return this.http.post<any>(updateSetURL, set, this.httpOptions);
  }

  shareScheduleSet(shareSet: any[]): Observable<any[]>{
    var updateSetURL = this.JPAPINewBaseURI + `/jpv2/projectmanager/shareset`;
    return this.http.post<any>(updateSetURL, shareSet, this.httpOptions);
  }

  createRequirement(requirement: any[]): Observable<any[]>{
    var updateSetURL = this.JPAPINewBaseURI + `/jpv2/requirements/create`;
    return this.http.post<any>(updateSetURL, requirement, this.httpOptions);
  }

  updateProjectManagerRequirements(requirements: any[]): Observable<any[]>{
    var updateReqsURL = this.JPAPINewBaseURI + `/jpv2/projectmanager/requirement/update`;
    return this.http.post<any>(updateReqsURL, requirements, this.httpOptions);
  }

  createScheduleSet(newSet: any): Observable<any[]>{
    var createSetURL = this.JPAPINewBaseURI + `/jpv2/projectmanager/createset`;
    newSet.UserID = this.userService.getCurrentUser().UserID;
    return this.http.post<any>(createSetURL, newSet, this.httpOptions);
  }

  addToScheduleSet(setUpdate: any): Observable<any[]>{
    var addSetURL = this.JPAPINewBaseURI + `/jpv2/projectmanager/addtoset`;
    return this.http.post<any>(addSetURL, setUpdate, this.httpOptions);
  }

  unshareScheduleSet(unshareSet: any[]){
    var unshareSetURL = this.JPAPINewBaseURI + `/jpv2/projectmanager/unshare`;
    const options = {
      headers: this.httpOptions.headers,
      body: [...unshareSet]
    };
    
    return this.http.delete<any>(unshareSetURL, options);
  }

  deleteScheduleSet(setId: number){
    var unshareSetURL = this.JPAPINewBaseURI + `/jpv2/projectmanager/deleteset`;
    const options = {
      headers: this.httpOptions.headers,
      body: {
        SetID: setId,
        UserID: this.userService.getCurrentUser().UserID
      }
    };
    
    return this.http.delete<any>(unshareSetURL, options);
  }

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
