import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FormValidationService } from 'app/@core/mock/form-validation.service';
import { FrameService } from 'app/@core/mock/frame.service';
import { UserService } from 'app/@core/mock/users.service';

@Component({
  selector: 'ngx-work-order-details',
  templateUrl: './work-order-details.component.html',
  styleUrls: ['./work-order-details.component.scss']
})
export class WorkOrderDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private frameService: FrameService,
    private httpService: HttpHandlerService,
    private fb: FormBuilder,
    private userService: UserService,
    public formValidationService: FormValidationService,
    private router: Router
  ) { }

  radioGroupValue = 'This is value 2';
  radioTest = true;

  workOrderId: any;

  workOrderInfoGridView: any
  workOrderInfo: any;
  workOrderInfoSave: any;

  projectForm: FormGroup = null;
  workOrderForm: FormGroup = null;
  inspectionForm: FormGroup = null;

  renderGrid: boolean = true;

  ngOnInit(): void {
    this.initForms();
    this.route.params.subscribe(params => {
      this.workOrderId = +params['workOrderID'];
      this.getWorkOrder();
    });
  }

  ngOnDestroy(): void {
    this.frameService.destroyAllToasts();
    this.projectForm.reset();
    this.workOrderForm.reset();
    this.inspectionForm.reset();
  }

  initForms() {
    this.projectForm = this.fb.group({
      ProjectType: [{ value: '', disabled: true }],
      ProjectNumber: [{ value: '', disabled: true }],
      WorkType: [{ value: '', disabled: true }],
      ProjectName: [{ value: '', disabled: true }],
      ProjectDescription: [{ value: '', disabled: true }],
    });

    this.workOrderForm = this.fb.group({
      WorkOrderNumber: [{ value: '', disabled: true }],
      WOCreatedDate: [{ value: '', disabled: true }],
      StatusID: ['', Validators.required],
      //Inspector: [''],
      InspectionType: [''],
      InspectionTypeID: ['', Validators.required],
      InspectorID: ['', Validators.required],
      ScheduledDate: ['', Validators.required],
      Notes: ['', Validators.required]
    });

    this.inspectionForm = this.fb.group({
      AdditionalFee: ['', Validators.required],
      InspectionTypeDescription: ['', Validators.required],
      InspectionDate: ['', Validators.required],
      Notes: ['']
    });
  }

  async getWorkOrder() {
    this.frameService.showLoader();
    await this.httpService.getWorkOrder(this.workOrderId).subscribe(
      (res: any) => {
        this.handleChecklistsResponse(res);
        this.frameService.hideLoader();
      },
      error => {
        this.frameService.hideLoader();
        this.frameService.showToastPrime('Error!', 'An error ocurred while fetching work order details.', 'error', 4000);
      });
  }

  navigateToGMapsAddress() {
    let url = 'https://maps.google.com/?q=' + this.workOrderInfo.info.Address;
    window.open(url, '_blank');
  }

  addCommentArea(field: any,) {
    field.AllComments.push('');
    // field.DisplayCommentArea = !field.DisplayCommentArea;
    // if (!field.DisplayCommentArea) {
    //   field.ExtraComment = null;
    // }
  }

  removeComment(field: any, index: number) {
    if (index > -1) {
      field.AllComments.splice(index, 1);
    }
  }

  jumpToURL(questionURL: any) {
    window.open(questionURL, '_blank');
  }

  tabChanged() {
    this.frameService.destroyAllToasts();
  }

  trackByFn(index, item) {
    return index;
  }

  extraInput(inputText: string, option: any) {
    option.ExtraComment = inputText;
  }

  extraInputComment(inputText: string, field: any, index: number) {
    field.AllComments[index] = inputText;
  }

  textDateNumericChanged(text: string, field: any) {
    field.TextAnswer = text;
  }

  onRadioChanged(field: any, option: any, section: any) {
    let prevOption = field.Options.find(x => x.ID == field.RadioGroupPreviousControlObject.ID);
    if (prevOption) {
      prevOption.ExtraComment = null;
    }
    if (field.RadioGroupPreviousControlObject.Score) {
      section.SumOfCheckedScores -= field.RadioGroupPreviousControlObject.Score;
      this.workOrderInfo.checklist.SumOfAllScores -= field.RadioGroupPreviousControlObject.Score;
    }
    if (option.Score) {
      section.SumOfCheckedScores += option.Score;
      this.workOrderInfo.checklist.SumOfAllScores += option.Score;

      let scoresMessage = '';
      let i = 1;
      this.workOrderInfo.checklist.forEach(checklist => {
        scoresMessage += `${i++}. Score for section: <b>${checklist.Description}</b> = <b>${checklist.SumOfCheckedScores}</b> \n`;
      });
      scoresMessage += `Sum of all Scores is <b>${this.workOrderInfo.checklist.SumOfAllScores}</b>`;
      this.frameService.showToastPrime('Score Info', scoresMessage, 'info', 4000, true, true);
    }

    field.RadioGroupPreviousControlObject = option;
  }

  toggleSingle(option: any, section: any) {
    option.Checked = !option.Checked;
    if (option.isOther && !option.Checked) {
      option.ExtraComment = null;
    }
    if (option.Score) {
      if (option.Checked) {
        section.SumOfCheckedScores += option.Score;
        this.workOrderInfo.checklist.SumOfAllScores += option.Score;

        let scoresMessage = '';
        let i = 1;
        this.workOrderInfo.checklist.forEach(checklist => {
          scoresMessage += `${i++}. Score for section: <b>${checklist.Description}</b> = <b>${checklist.SumOfCheckedScores}</b> \n`;
        });
        scoresMessage += `Sum of all Scores is <b>${this.workOrderInfo.checklist.SumOfAllScores}</b>`;
        this.frameService.showToastPrime('Score Info', scoresMessage, 'info', 4000, true, true);
      }
      else {
        section.SumOfCheckedScores -= option.Score;
        this.workOrderInfo.checklist.SumOfAllScores -= option.Score;
      }
    }
  }

  handleChecklistsResponse(res: any) {
    // res.RenderGrid = true;
    // this.renderGrid = res.RenderGrid;

    this.workOrderInfo = res;
    this.workOrderInfo.info.InspectionTypeID = this.workOrderInfo.info.InspectionTypeID.toString();
    this.workOrderInfoSave = JSON.parse(JSON.stringify(res));


    if (this.workOrderInfo.info.ChecklistRenderMode == 1) { //this.renderGrid
      this.extendDataForGridRender(this.workOrderInfo)
    }
    this.extendResponseData(this.workOrderInfo);


    this.projectForm.patchValue(this.workOrderInfo.info);
    this.workOrderForm.patchValue(this.workOrderInfo.info);
    this.workOrderForm.patchValue({
      WorkOrderNumber: this.workOrderId,
      InspectorID: this.workOrderInfo.info.InspectorID.toString(),
      StatusID: this.workOrderInfo.info.StatusID.toString(),
      WOCreatedDate: new Date(this.workOrderInfo.info.WOCreatedDate),
      ScheduledDate: new Date(this.workOrderInfo.info.ScheduledDate)
    });
  }

  removeColumnAnswers(columnAnswerIndex) {
    this.frameService.showLoader();
    this.workOrderInfoGridView.QuestionCols.splice(-1, 1);

    this.workOrderInfoGridView.AllChecklistsGrouped.forEach(section => {
      section.Fields.forEach(field => {
        field.QuestionsList.splice(columnAnswerIndex, 1);
      });
    });
    this.frameService.hideLoader();
  }

  addNewAnswerCol() {
    this.frameService.showLoader();
    let questionColsLength = this.workOrderInfoGridView.QuestionCols.length;
    this.workOrderInfoGridView.QuestionCols.push(++questionColsLength);
    // this.workOrderInfoGridView.AllChecklistsGrouped.forEach(section => {
    //   section.Fields.forEach(field => {
    //     let questionDuplicateObject = JSON.parse(JSON.stringify(field));
    //     questionDuplicateObject.CheckboxMultiSelectValuesGrid = [];
    //     questionDuplicateObject.CheckboxSelectValueGrid = null;
    //     field.QuestionsList.push(questionDuplicateObject);
    //   });
    // });
    let k = 0;
    while (k < this.workOrderInfoGridView.AllChecklistsGrouped.length) {
      this.test(k++);
    }


    // for (var i = 0, n = this.workOrderInfoGridView.AllChecklistsGrouped.length; i < n; i++) {
    //   for (var j = 0, m = this.workOrderInfoGridView.AllChecklistsGrouped[i].Fields.length; j < m; j++) {
    //     let questionDuplicateObject = JSON.parse(JSON.stringify(this.workOrderInfoGridView.AllChecklistsGrouped[i].Fields[j]));
    //     questionDuplicateObject.CheckboxMultiSelectValuesGrid = [];
    //     questionDuplicateObject.CheckboxSelectValueGrid = null;
    //     this.workOrderInfoGridView.AllChecklistsGrouped[i].Fields[j].QuestionsList.push(questionDuplicateObject);
    //   }
    // }
    this.frameService.hideLoader();
  }

  test(pp: number) {
    for (var j = 0, m = this.workOrderInfoGridView.AllChecklistsGrouped[pp].Fields.length; j < m; j++) {
      let questionDuplicateObject = JSON.parse(JSON.stringify(this.workOrderInfoGridView.AllChecklistsGrouped[pp].Fields[j]));
      questionDuplicateObject.CheckboxMultiSelectValuesGrid = [];
      questionDuplicateObject.CheckboxSelectValueGrid = null;
      this.workOrderInfoGridView.AllChecklistsGrouped[pp].Fields[j].QuestionsList.push(questionDuplicateObject);
    }

    // if(pp < this.workOrderInfoGridView.AllChecklistsGrouped.length - 1){
    //   this.test(pp+1);
    // }
  }

  extendDataForGridRender(workOrderInfo: any) {
    this.workOrderInfoGridView = JSON.parse(JSON.stringify(workOrderInfo));
    this.workOrderInfoGridView.AllChecklistsGrouped = [];
    this.workOrderInfoGridView.QuestionCols = [1];
    this.workOrderInfoGridView.checklist.forEach(section => {

      section.Fields.forEach(field => {
        let questionDuplicateObject = JSON.parse(JSON.stringify(field));
        questionDuplicateObject.CheckboxMultiSelectValuesGrid = [];
        questionDuplicateObject.CheckboxSelectValueGrid = null;
        field.QuestionsList = [questionDuplicateObject];
      });
      this.workOrderInfoGridView.AllChecklistsGrouped.push(section);
    });
  }

  extendResponseData(workOrderInfo: any) {
    this.extendChecklistsSection(workOrderInfo.checklist);
    workOrderInfo.resultOptionsControl = null;
  }

  extendChecklistsSection(workOrderChecklists) {
    workOrderChecklists.SumOfAllScores = 0;
    workOrderChecklists?.forEach(section => {
      section.SumOfCheckedScores = 0;
      section.Fields.forEach(field => {
        field.DisplayCommentArea = false;
        field.ExtraComment = null;
        field.AllComments = [];
        if (field.ControlType == 'RadioButton') {
          if (field.Options) {
            let selectedOption = field.Options.find(x => x.isDefault);
            if (selectedOption) {
              //*** ADD RADIOGROUP CONTROL PROPERTY ***
              field.RadioGroupControl = selectedOption.ID.toString();
              field.RadioGroupPreviousControlObject = selectedOption;
              //*** Calculate current Sum of Scores inside section ***
              if (selectedOption.Score) {
                section.SumOfCheckedScores += selectedOption.Score;
              }
            }
          }
        }
        if (field.ControlType == 'CheckBox') {
          if (field.Options) {
            field.Options.forEach(option => {
              //*** ADD CHECKBOX OPTION CHECKED CONTROL PROPERTY ***
              option.Checked = option.isDefault;
              //*** Calculate current Sum of Scores inside section ***
              if (option.Checked && option.Score) {
                section.SumOfCheckedScores += option.Score;
              }
            });
          }
        }
      });

      workOrderChecklists.SumOfAllScores += section.SumOfCheckedScores;
    });
  }

  async updateWorkOrder() {
    this.formValidationService.formSubmitAttempt = true;
    if (this.workOrderForm.valid) {
      this.frameService.showLoader();
      let workOrderUpdateObj = this.workOrderForm.value;
      let woUpdateObjForPost = {
        InspectionTypeID: +workOrderUpdateObj.InspectionTypeID,
        AssignedToID: +workOrderUpdateObj.InspectorID,
        WorkOrderStatusID: +workOrderUpdateObj.StatusID,
        Scheduled: workOrderUpdateObj.ScheduledDate,
        Notes: workOrderUpdateObj.Notes
      }

      await this.httpService.updateWorkOrder(woUpdateObjForPost, this.workOrderId).subscribe(
        (res: any) => {
          this.handleChecklistsResponse(res);
          this.frameService.hideLoader();
        },
        error => {
          this.frameService.hideLoader();
          this.frameService.showToastPrime('Error!', 'Update Work Order Failed.', 'error', 4000);
        });
    }
  }

  async saveInspection() {
    this.formValidationService.formSubmitAttempt = true;
    if (this.inspectionForm.valid) {
      this.frameService.showLoader();
      let inspectionFormObj = this.inspectionForm.value;

      //inspection part of the request
      let inspectionPostObj = {
        WorkOrderID: this.workOrderId,
        ResultTypeID: Number(this.workOrderInfo.resultOptionsControl) || -1, //double check
        UserID: this.userService.getCurrentUser().UserID,
        InspectionDateTime: inspectionFormObj.InspectionDate,
        InspectionNotes: inspectionFormObj.Notes,
        AdditionalFeeID: +inspectionFormObj.AdditionalFee,
        Checklist: []
      }

      if (this.workOrderInfo.info.ChecklistRenderMode == 0) {
        this.packChecklists(inspectionPostObj);
      }
      else {
        this.packChecklistsGrid(inspectionPostObj);
      }


      await this.httpService.saveInspection(inspectionPostObj).subscribe(
        (res: any) => {
          //TODO HANDLE
          this.frameService.showToastPrime('Success!', 'Successfully Created Inspection. You will now be redirected to work orders list..', 'success', 4000);
          setTimeout(() => {
            this.frameService.hideLoader();
            this.router.navigate(['/pages/layout/myworkorders']);
          }, 2000);
        },
        error => {
          this.frameService.hideLoader();
          this.frameService.showToastPrime('Error!', 'Saving Inspection Failed.', 'error', 4000);
        });
    }
  }

  packChecklists(inspectionPostObj: any) {
    this.workOrderInfo.checklist.forEach(checklist => {
      checklist.Fields.forEach(question => {
        let answers = [];

        if (question.ControlType == 'CheckBox') {
          question.Options.forEach(option => {
            if (option.Checked) {
              let answer = {
                AnswerID: null,
                AnswerText: null
              }
              answer.AnswerID = option.ID;
              if (option.ExtraComment) {
                answer.AnswerText = option.ExtraComment;
              }
              answers.push(answer);
            }
          });
        }
        else if (question.ControlType == 'RadioButton' && question.RadioGroupControl) {
          let answer = {
            AnswerID: null,
            AnswerText: null
          }

          answer.AnswerID = +question.RadioGroupControl;
          let selectedOption = question.Options.find(x => x.ID == answer.AnswerID);
          if (selectedOption && selectedOption.ExtraComment) {
            answer.AnswerText = selectedOption.ExtraComment;
          }

          answers.push(answer);
        }
        else {
          let answer = {
            AnswerID: null,
            AnswerText: question.TextAnswer ? question.TextAnswer : null
          }

          answers.push(answer);
        }

        //questionaire part of the request
        let questionRequestObj = {
          QuestionID: question.QuestionID,
          Comments: question?.AllComments,
          Answers: answers
        }

        inspectionPostObj.Checklist.push(questionRequestObj);
      });
    });
  }

  packChecklistsGrid(inspectionPostObj: any) {
    this.workOrderInfoGridView.AllChecklistsGrouped.forEach(checklist => {
      checklist.Fields.forEach(question => {
        let answers = [];

        if (question.ControlType == 'CheckBox') {
          question.QuestionsList.forEach((questionObj, index) => {

            questionObj.CheckboxMultiSelectValuesGrid.forEach(qAnswer => {
              let answer = {
                AnswerID: null,
                AnswerText: null,
                ColumnID: index+1
              }

              answer.AnswerID = +qAnswer; //number or string??
              // if (option.ExtraComment) {
              //   answer.AnswerText = option.ExtraComment;
              // }
              answers.push(answer);
            });
          });
        }
        else if (question.ControlType == 'RadioButton') { //&& question.RadioGroupControl) {
          question.QuestionsList.forEach((questionObj, index) => {
            let answer = {
              AnswerID: null,
              AnswerText: null,
              ColumnID: index+1
            }

            answer.AnswerID = +questionObj.CheckboxSelectValueGrid;
            // let selectedOption = question.Options.find(x => x.ID == answer.AnswerID);
            // if (selectedOption && selectedOption.ExtraComment) {
            //   answer.AnswerText = selectedOption.ExtraComment;
            // }

            answers.push(answer);
          })
        }
        else {
          question.QuestionsList.forEach((questionObj, index) => {
            let answer = {
              AnswerID: null,
              AnswerText: questionObj.TextAnswer ? questionObj.TextAnswer : null,
              ColumnID: index+1
            }

            answers.push(answer);
          })
        }

        //questionaire part of the request
        let questionRequestObj = {
          QuestionID: question.QuestionID,
          Comments: question?.AllComments,
          Answers: answers
        }

        inspectionPostObj.Checklist.push(questionRequestObj);
      });
    });
  }

}
