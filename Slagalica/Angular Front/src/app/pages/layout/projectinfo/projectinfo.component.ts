import { ChangeDetectorRef, Component, HostBinding, HostListener, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbComponentStatus, NbIconConfig, NbToastrService } from '@nebular/theme';
import { HttpHandlerService } from 'app/@core/http/http-handler.service';
import { FormValidationService } from 'app/@core/mock/form-validation.service';
import { FrameService } from 'app/@core/mock/frame.service';
import { ProjectService } from 'app/@core/mock/project.service';
import { ConfirmationService } from 'primeng/api';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'ngx-projectinfo',
  templateUrl: './projectinfo.component.html',
  styleUrls: ['./projectinfo.component.scss']
})
export class ProjectInfo implements OnInit {

  constructor(
    private httpService: HttpHandlerService,
    private fb: FormBuilder,
    public renderer: Renderer2,
    private frameService: FrameService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
    public projectService: ProjectService,
    public formValidationService: FormValidationService,
    private route: ActivatedRoute
  ) { }

  //renderingDone: boolean = true;
  checked: boolean = false;

  permitId: number = null;

  checklists: any = new Object();
  checklistsForSave: any = new Object();

  sectionsOnTabs: any[] = [];
  sectionsOnModules: any[] = [];

  checklistForms = new FormArray([]);
  checklistFormsOnTabs = new FormArray([]);

  onSectionControls = [];
  onTabsControls = [];

  Math = Math;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.permitId = +params['permitId'];
      this.searchChecklists();
    });
  }

  duplicateSection(sectionData: any, sectionFormControl: FormGroup, isSectionOnModule: boolean = false) {
    let sectionDuplicate = this.createNewSectionAndProcess(sectionData, isSectionOnModule);
    let formControlKeys = [];

    Object.keys(sectionFormControl.controls).forEach(key => {
      let formControlKeyObj = {
        key: key,
        isLabelEdit: false
      }

      formControlKeys.push(formControlKeyObj);
    });

    let duplicateForm = this.createFormGroup(sectionDuplicate);
    this.pushControlKeysAndForm(isSectionOnModule ? this.onSectionControls : this.onTabsControls, formControlKeys, isSectionOnModule ? this.checklistForms : this.checklistFormsOnTabs, duplicateForm);
    this.cdr.detectChanges();
  }

  removeSection(sectionData: any, sectionFormControl: FormGroup, isSectionOnModule: boolean = false) {
    // If section does not exist on backend and we are trying to remove it, we remove it only from the client side
    if (sectionData.SectionID == 0) {
      this.removeSectionFromPage(sectionData, sectionFormControl, isSectionOnModule);
      this.cdr.detectChanges();
    }
    // Section exists on backend and we must remove it from database and from the client side
    else {
      this.projectService.globalSaveVisible = false;//!this.isDialogActive && (this.checklistFormsOnTabs && this.checklistFormsOnTabs.controls.length > 0) || (this.checklistForms && this.checklistForms.controls.length > 0);
      this.confirmationService.confirm({
        message: `Are you sure that you want to remove ${sectionData.SectionName} section ?`,
        accept: () => {
          this.frameService.showLoader()
          this.httpService.removeTabSection(this.permitId, sectionData.SectionID).subscribe(res => {
            if (res.complete) {
              this.removeSectionFromPage(sectionData, sectionFormControl, isSectionOnModule);
              this.projectService.globalSaveVisible = true;
              this.frameService.hideLoader();
              this.frameService.showToastPrime('Success!', 'Successfully Removed Section', 'success', 4000);
            }
            else {
              this.projectService.globalSaveVisible = true;
              this.frameService.hideLoader();
              this.frameService.showToastPrime('Error!', 'Failed To Remove Section. Something Went Wrong.', 'error', 4000);
            }
            this.cdr.detectChanges();
          });
        },
        reject: () => {
          this.projectService.globalSaveVisible = true;
        }
      });
    }
  }

  removeSectionFromPage(sectionData: any, sectionFormControl: FormGroup, isSectionOnModule: boolean) {
    if (isSectionOnModule) {
      const index = this.checklistForms.controls.indexOf(sectionFormControl, 0);
      if (index > -1) {
        this.checklistsForSave.Sections.splice(this.checklistsForSave.Sections.findIndex(x => x.SectionID == sectionData.SectionID && x.CreateByID == sectionData.CreateByID), 1);
        this.sectionsOnModules.splice(this.sectionsOnModules.findIndex(x => x.SectionID == sectionData.SectionID && x.CreateByID == sectionData.CreateByID), 1);
        this.checklistForms.controls.splice(index, 1);
        this.onSectionControls.splice(index, 1);
      }
    }
    else {
      const index = this.checklistFormsOnTabs.controls.indexOf(sectionFormControl, 0);
      if (index > -1) {
        this.checklistsForSave.Sections.splice(this.checklistsForSave.Sections.findIndex(x => x.SectionID == sectionData.SectionID && x.CreateByID == sectionData.CreateByID), 1);
        this.sectionsOnTabs.splice(this.sectionsOnTabs.findIndex(x => x.SectionID == sectionData.SectionID && x.CreateByID == sectionData.CreateByID), 1);
        this.checklistFormsOnTabs.controls.splice(index, 1);
        this.onTabsControls.splice(index, 1);
      }
    }
  }

  createNewSectionAndProcess(sectionData: any, isSectionOnModule: boolean) {
    var sectionDuplicate = JSON.parse(JSON.stringify(sectionData));
    sectionDuplicate.SectionID = 0;
    //sectionDuplicate.IsDuplicate = true;
    sectionDuplicate.CreateByID = new Date().getMilliseconds();
    sectionDuplicate.IsAdditional = true;

    sectionDuplicate.Fields.forEach((field, fieldIndex) => {
      field.FieldID = 0;
      field.FieldValue = null;
      field.CreateByID = fieldIndex; //unique CreateByID is calculated based on timestamp+fieldIndex string
      if (field.FieldTemplate == 'CheckboxList' || field.FieldTemplate == 'CheckboxListDB') {
        field.Options.forEach(option => {
          option.isChecked = false;
        });
      }
    });

    isSectionOnModule ? this.sectionsOnModules.push(sectionDuplicate) : this.sectionsOnTabs.push(sectionDuplicate);
    this.checklistsForSave.Sections.push(sectionDuplicate);
    return sectionDuplicate;
  }

  // editLabel(field: any, inputElementId: string) {
  //   field.isLabelEdit = !field.isLabelEdit;
  //   let labelElement = (document.getElementById(inputElementId) as HTMLInputElement);
  //   setTimeout(() => {
  //     labelElement.focus();
  //   }, 0);
  // }

  renameSection(section: any) {
    section.renameTabSection = !section.renameTabSection;
    // let tabSectionRenameElement = (document.getElementById(inputElementId) as HTMLInputElement);
    // setTimeout(() => {
    //   tabSectionRenameElement.focus();
    // }, 0);
  }

  saveEditSection(section: any, i_Counter: number, isSectionOnModule: boolean = false) {
    section.renameTabSection = !section.renameTabSection;

    //rename SectionName
    let elementId = isSectionOnModule ? i_Counter.toString() + '_SectionTitleModule' : i_Counter.toString() + '_SectionTitleTab';
    let labelElement = (document.getElementById(elementId) as HTMLInputElement);
    if (labelElement.value) {
      section.SectionName = labelElement.value;
      section.CustomLabel = labelElement.value;
      labelElement.value = '';

      var sectionOnSaveObj = this.checklistsForSave.Sections.find(x => x.SectionID == section.SectionID && x.CreateByID == section.CreateByID);
      sectionOnSaveObj.SectionName = section.SectionName;
      sectionOnSaveObj.CustomLabel = section.CustomLabel;
    }

    //rename each field label name in section form
    if (isSectionOnModule) {
      this.onSectionControls[i_Counter].forEach((field, j) => {
        let elementId = i_Counter.toString() + '_' + j.toString() + '_EditLabel';
        let labelElement = (document.getElementById(elementId) as HTMLInputElement);
        if (labelElement.value) {
          let fieldObj = this.sectionsOnModules[i_Counter].Fields[j];
          fieldObj.FieldName = labelElement.value;
          fieldObj.CustomLabel = labelElement.value;
          labelElement.value = '';

          var sectionOnSaveObj = this.checklistsForSave.Sections.find(x => x.SectionID == section.SectionID && x.CreateByID == section.CreateByID);
          var fieldForSave = sectionOnSaveObj.Fields.find(x => x.FieldID == fieldObj.FieldID && x.IsAutoMap == fieldObj.IsAutoMap && x.AutoMapFieldName == fieldObj.AutoMapFieldName && x.CreateByID == fieldObj.CreateByID);
          fieldForSave.FieldName = fieldObj.FieldName;
          fieldForSave.CustomLabel = fieldObj.CustomLabel;
        }
      });
    }
    else {
      this.onTabsControls[i_Counter].forEach((field, j) => {
        let elementId = i_Counter.toString() + '_' + j.toString() + '_EditLabelTab';
        let labelElement = (document.getElementById(elementId) as HTMLInputElement);
        if (labelElement.value) {
          let fieldObj = this.sectionsOnTabs[i_Counter].Fields[j];
          fieldObj.FieldName = labelElement.value;
          fieldObj.CustomLabel = labelElement.value;
          labelElement.value = '';

          var sectionOnSaveObj = this.checklistsForSave.Sections.find(x => x.SectionID == section.SectionID && x.CreateByID == section.CreateByID);
          var fieldForSave = sectionOnSaveObj.Fields.find(x => x.FieldID == fieldObj.FieldID && x.IsAutoMap == fieldObj.IsAutoMap && x.AutoMapFieldName == fieldObj.AutoMapFieldName && x.CreateByID == fieldObj.CreateByID);
          fieldForSave.FieldName = fieldObj.FieldName;
          fieldForSave.CustomLabel = fieldObj.CustomLabel;
        }
      });
    }
    this.cdr.detectChanges();
  }

  cancelEditSection(section: any) {
    section.renameTabSection = !section.renameTabSection;
  }

  @HostListener('blur', ['$event.target']) saveNewTabSectionName(elementId, section: any) {
    section.renameTabSection = !section.renameTabSection;
    let labelElement = (document.getElementById(elementId) as HTMLInputElement);
    if (labelElement.value) {
      section.SectionName = labelElement.value;
      section.CustomLabel = labelElement.value;
      labelElement.value = '';

      var sectionOnSaveObj = this.checklistsForSave.Sections.find(x => x.SectionID == section.SectionID && x.CreateByID == section.CreateByID);
      sectionOnSaveObj.SectionName = section.SectionName;
      sectionOnSaveObj.CustomLabel = section.CustomLabel;
    }
  }

  @HostListener('blur', ['$event.target']) renameFieldLabel(elementId, field, section: any, fieldObj: any) {
    field.isLabelEdit = !field.isLabelEdit;
    let labelElement = (document.getElementById(elementId) as HTMLInputElement);
    if (labelElement.value) {
      fieldObj.FieldName = labelElement.value;
      labelElement.value = '';

      var sectionOnSaveObj = this.checklistsForSave.Sections.find(x => x.SectionID == section.SectionID && x.CreateByID == section.CreateByID);
      var fieldForSave = sectionOnSaveObj.Fields.find(x => x.FieldID == fieldObj.FieldID && x.IsAutoMap == fieldObj.IsAutoMap && x.AutoMapFieldName == fieldObj.AutoMapFieldName && x.CreateByID == fieldObj.CreateByID);
      fieldForSave.FieldName = fieldObj.FieldName;
    }
  }

  searchChecklists() {
    this.frameService.showLoader();
    this.projectService.globalSaveVisible = false;
    this.emptyArrays();
    this.httpService.getChecklists(this.permitId).subscribe(
      (res: any) => {
        this.handleChecklistsResponse(res);
        this.projectService.globalSaveVisible = true;
        this.frameService.hideLoader();
        this.frameService.showToastPrime('Success!', 'Successfully Packed Checklists', 'success', 4000);
      },
      error => {
        this.frameService.hideLoader();
        this.frameService.showToastPrime('Error!', 'An error ocurred while fetching the checklists info, or provided Permit ID is wrong.', 'error', 4000);
      }
    );
  }

  handleChecklistsResponse(res: any) {
    this.checklists = res;
    this.checklistsForSave = JSON.parse(JSON.stringify(res));
    this.sectionsOnTabs = res.Sections.filter(x => x.DisplayMode != 2);
    this.sectionsOnModules = res.Sections.filter(x => x.DisplayMode == 2);
    this.renderPageByData(this.checklists);
  }

  emptyArrays() {
    this.checklistForms.controls = [];
    this.checklistFormsOnTabs.controls = [];
    this.onSectionControls = [];
    this.onTabsControls = [];
  }

  renderPageByData(data: any) {
    data.Sections.forEach(section => {
      section.renameTabSection = false;

      //UNCOMMENT THIS FOR TESTING REQUIRED FIELDS
      // section.Fields.forEach(field => {
      //   field.Required = true;
      // });

      section.Fields.filter(x => x.FieldTemplate == 'CheckboxList').forEach(field => {
        let checkedItems = (typeof field.FieldValue === 'string' && field.FieldValue) ? JSON.parse(field.FieldValue) : field.FieldValue;
        field.Options.forEach(option => {
          //Need to check what checkboxes are checked from the FieldValue property of the section
          //And based on that set new property isChecked value on the option object
          option.isChecked = false;
          if (checkedItems && checkedItems.some(x => x == option.ID || x.ID == option.ID)) {
            option.isChecked = true;
          }
        });
      });

      section.Fields.filter(x => x.FieldTemplate == 'CheckboxListDB').forEach(field => {
        let checkedItems = (typeof field.FieldValue === 'string' && field.FieldValue) ? JSON.parse(field.FieldValue) : field.FieldValue;
        field.Options.forEach(option => {
          //Need to check what checkboxes are checked from the FieldValue property of the section
          //And based on that set new property isChecked value on the option object
          option.isChecked = false;
          var optionProperties = Object.keys(option);
          if (checkedItems && checkedItems.some(x => x == option[optionProperties[0]] || x.ID == option[optionProperties[0]])) {
            option.isChecked = true;
          }
        });
      });

      let form = this.createFormGroup(section);
      let formControlKeys = [];

      Object.keys(form.controls).forEach(key => {
        let formControlKeyObj = {
          key: key,
          isLabelEdit: false
        }

        formControlKeys.push(formControlKeyObj);
      });

      if (section.DisplayMode == 2) {
        this.pushControlKeysAndForm(this.onSectionControls, formControlKeys, this.checklistForms, form);
      }
      else {
        this.pushControlKeysAndForm(this.onTabsControls, formControlKeys, this.checklistFormsOnTabs, form);
      }
    });
  }

  pushControlKeysAndForm(controlKeysArray: any, controlKeysCalculated: any, formsArray: any, form: FormGroup) {
    controlKeysArray.push(controlKeysCalculated);
    formsArray.push(form);
  }

  createFormGroup(section: any): FormGroup {
    var form = this.fb.group({});
    section.Fields.forEach(field => {
      if (field.FieldTemplate == 'MultiselectListDB') {
        form.addControl(field.FieldName.replace(/\s/g, ""), new FormControl(this.getSelectedOptions(field.FieldValue), field.Required ? Validators.required : null));
      }
      else if (field.FieldTemplate == 'Checkbox') {
        form.addControl(field.FieldName.replace(/\s/g, ""), new FormControl(this.getSingleCheckboxValue(field.FieldValue), field.Required ? Validators.requiredTrue : null));
      }
      else if (field.FieldTemplate == 'CheckboxList' || field.FieldTemplate == 'CheckboxListDB') {
        form.addControl(field.FieldName.replace(/\s/g, ""), new FormControl(this.getCheckboxListValue(field.FieldValue), field.Required ? Validators.required : null));
      }
      else if (field.FieldTemplate == 'DatePicker') {
        form.addControl(field.FieldName.replace(/\s/g, ""), new FormControl(this.getDateValue(field.FieldValue), field.Required ? Validators.required : null));
      }
      else {
        form.addControl(field.FieldName.replace(/\s/g, ""), new FormControl(field.FieldValue, field.Required ? Validators.required : null));
      }
    });

    return form;
  }

  getSingleCheckboxValue(fieldValue: any) {
    if (fieldValue) {
      return JSON.parse(fieldValue);
    }

    return null;
  }

  getDateValue(dateValue: any) {
    if (dateValue) {
      return new Date(dateValue);
    }

    return null;
  }

  //ZASTO SE OVO OKIDA ZILION PUTA NA BEZ RAZLOGA??? VALUE PROPERTY NA INPUTU GA NESTO CIMA
  getExtraInfo(fieldValue: any, option: any) {
    let checkedItems = typeof fieldValue === 'string' ? JSON.parse(fieldValue) : fieldValue;
    if (checkedItems) {
      const optionProperties = Object.keys(option);
      const extraInfoObj = checkedItems.find(x => x.ID == option[optionProperties[0]]);
      return extraInfoObj ? extraInfoObj.Extra : "";
    }

    return "";
  }

  getCheckboxListValue(checkboxListValue: any) {
    var value = (typeof checkboxListValue === 'string' && checkboxListValue) ? JSON.parse(checkboxListValue) : checkboxListValue;
    return value;
  }

  // appendToBody(ref1: any) {
  //   this.renderer.appendChild(document.body, ref1.document);
  // }

  extraInput(event: string, option: any, section: FormGroup, field: string) {
    const optionProperties = Object.keys(option);
    var formControlValue = section.get(field).value;
    var item = formControlValue.find(x => x.ID == option[optionProperties[0]]);
    if (item) {
      item.Extra = event;
    }
  }

  toggle(event: boolean, option: any, section: FormGroup, field: string, fieldObj: any) {
    option.isChecked = event;
    const useExtraDataOnCheck = fieldObj.UseExtraDataOnCheck;
    var initialFieldValue = fieldObj.FieldValue;
    const optionProperties = Object.keys(option);
    var formControlValue = section.get(field).value;
    var initialFieldValueObj = typeof initialFieldValue === 'string' ? JSON.parse(initialFieldValue) : initialFieldValue;

    // If there is extra input on check
    if (useExtraDataOnCheck) {
      // If we checked TRUE -> add new item to formControlValue
      if (option.isChecked) {
        const extraInfoObj = initialFieldValueObj ? initialFieldValueObj.find(x => x.ID == option[optionProperties[0]]) : null;
        var newItem = {
          ID: option[optionProperties[0]],
          Extra: extraInfoObj ? extraInfoObj.Extra : ""
        };
        if (formControlValue) {
          formControlValue.push(newItem);
        }
        else {
          formControlValue = [];
          formControlValue.push(newItem);
        }
      }
      // If we checked FALSE -> remove item from formControlValue
      else {
        var item = formControlValue.find(x => x.ID == option[optionProperties[0]]);
        if (item) {
          //update extra info on item so the extra input will have the previous value if checked again
          let initFieldValueObj = initialFieldValueObj ? initialFieldValueObj.find(x => x.ID == item.ID) : null;
          if (initFieldValueObj) {
            initFieldValueObj.Extra = item.Extra;
          }
          else {
            if (initialFieldValueObj) {
              initialFieldValueObj.push(item);
            }
            else {
              initialFieldValueObj = [];
              initialFieldValueObj.push(item);
            }
          }
          fieldObj.FieldValue = JSON.stringify(initialFieldValueObj);

          const index = formControlValue.indexOf(item, 0);
          if (index > -1) {
            formControlValue.splice(index, 1);
          }
        }
      }
    }
    // Without extra input on check
    else {
      if (option.isChecked) {
        if (formControlValue) {
          formControlValue.push(option[optionProperties[0]]);
        }
        else {
          formControlValue = [];
          formControlValue.push(option[optionProperties[0]]);
        }
      }
      else {
        const index = formControlValue.indexOf(option[optionProperties[0]], 0);
        if (index > -1) {
          formControlValue.splice(index, 1);
        }
      }
    }

    section.get(field).setValue(formControlValue);
  }

  toggleSingle(event: boolean, section: FormGroup, field: string) {
    section.get(field).setValue(event);
  }

  toggleSingleNonForm(event: boolean, section: any) {
    section.SectionCompleted = event;

    var sectionOnSaveObj = this.checklistsForSave.Sections.find(x => x.SectionID == section.SectionID && x.CreateByID == section.CreateByID);
    sectionOnSaveObj.SectionCompleted = event;
  }

  preventEChar(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 69 || charCode == 101) {
      return false;
    }

    return true;
  }

  isExtraInputNeeded(option: any, isCheckboxListDB: boolean = false) {
    var optionProperties = Object.keys(option);
    if (isCheckboxListDB) {
      if (optionProperties.indexOf('isqty') > -1) {
        return option['isqty'] && option.isChecked;
      }
    }
    else {
      if (optionProperties.indexOf('UseExtraInfo') > -1) {
        return option['UseExtraInfo'] && option.isChecked;
      }
    }

    return false;
  }

  getLabel(option: any, isInside: boolean) {
    var optionProperties = Object.keys(option);
    let label = isInside ? option[optionProperties[3]] : option[optionProperties[1]];
    return label;
  }

  getDropdownValue(option: any) {
    var optionProperties = Object.keys(option);
    return option[optionProperties[0]];
  }

  getSelectedOptions(options: any) {
    const optionObjects = (typeof options === 'string' && options) ? JSON.parse(options) : options;
    const selectedOptions: string[] = [];
    if (optionObjects) {
      optionObjects.forEach(optionValueId => {
        selectedOptions.push(optionValueId.toString());
      });
    }

    return selectedOptions;
  }

  packAndSaveAllForms() {
    this.frameService.showLoader();
    this.formValidationService.formSubmitAttempt = true;
    let formsValidationResult = this.areFormsValid();
    if (!formsValidationResult.areAllFormsValid) {
      this.frameService.hideLoader();
      this.frameService.showToastPrime('Error!', formsValidationResult.formErrorMessage, 'error', 6000);
      return;
    }

    let formValuesOnSections = [];
    let formValuesOnTabs = [];
    this.checklistForms.controls.forEach(form => {
      formValuesOnSections.push(form.value);
    });

    this.checklistFormsOnTabs.controls.forEach(form => {
      formValuesOnTabs.push(form.value);
    });

    // loop through response json object and pack the data 
    // based on the form values (MODULES)
    this.sectionsOnModules.forEach((section, sectionIndex) => {
      var sectionOnSaveObj = this.checklistsForSave.Sections.find(x => x.SectionID == section.SectionID && x.CreateByID == section.CreateByID);
      section.Fields.forEach((field, fieldIndex) => {
        var fieldForSave = sectionOnSaveObj.Fields.find(x => x.FieldID == field.FieldID && x.IsAutoMap == field.IsAutoMap && x.AutoMapFieldName == field.AutoMapFieldName && x.CreateByID == field.CreateByID);
        let fieldValue = formValuesOnSections[sectionIndex][this.onSectionControls[sectionIndex][fieldIndex].key];
        if (fieldForSave.FieldTemplate == 'DropdownList' || fieldForSave.FieldTemplate == 'DropdownListDB'
          || fieldForSave.FieldTemplate == 'Textbox' || fieldForSave.FieldTemplate == 'MemoBox' || fieldForSave.FieldTemplate == 'Numeric') {
          fieldForSave.FieldValue = fieldValue != null ? fieldValue.toString() : fieldValue;
        }
        else if (fieldForSave.FieldTemplate == 'DatePicker') {
          if (fieldValue != null) {
            let dd = fieldValue.getDate();
            let mm = fieldValue.getMonth() + 1;
            const yyyy = fieldValue.getFullYear();
            if (dd < 10) {
              dd = `0${dd}`;
            }
            if (mm < 10) {
              mm = `0${mm}`;
            }
            fieldValue = `${yyyy}-${mm}-${dd}`;
          }
          fieldForSave.FieldValue = fieldValue;
        }
        else {
          fieldForSave.FieldValue = fieldValue != null ? JSON.stringify(fieldValue) : fieldValue;
        }
      });
    });

    // loop through response json object and pack the data 
    // based on the form values (TABS)
    this.sectionsOnTabs.forEach((tabSection, tabSectionIndex) => {
      var sectionOnSaveObj = this.checklistsForSave.Sections.find(x => x.SectionID == tabSection.SectionID && x.CreateByID == tabSection.CreateByID);
      tabSection.Fields.forEach((field, fieldIndex) => {
        var fieldForSave = sectionOnSaveObj.Fields.find(x => x.FieldID == field.FieldID && x.IsAutoMap == field.IsAutoMap && x.AutoMapFieldName == field.AutoMapFieldName && x.CreateByID == field.CreateByID);
        let fieldValue = formValuesOnTabs[tabSectionIndex][this.onTabsControls[tabSectionIndex][fieldIndex].key];
        if (fieldForSave.FieldTemplate == 'DropdownList' || fieldForSave.FieldTemplate == 'DropdownListDB'
          || fieldForSave.FieldTemplate == 'Textbox' || fieldForSave.FieldTemplate == 'MemoBox' || fieldForSave.FieldTemplate == 'Numeric') {
          fieldForSave.FieldValue = fieldValue != null ? fieldValue.toString() : fieldValue;
        }
        else if (fieldForSave.FieldTemplate == 'DatePicker') {
          if (fieldValue != null) {
            let dd = fieldValue.getDate();
            let mm = fieldValue.getMonth() + 1;
            const yyyy = fieldValue.getFullYear();
            if (dd < 10) {
              dd = `0${dd}`;
            }
            if (mm < 10) {
              mm = `0${mm}`;
            }
            fieldValue = `${yyyy}-${mm}-${dd}`;
          }
          fieldForSave.FieldValue = fieldValue;
        }
        else {
          fieldForSave.FieldValue = fieldValue != null ? JSON.stringify(fieldValue) : fieldValue;
        }
      });
    });

    this.httpService.saveChecklists(this.checklistsForSave, this.permitId).subscribe(
      (res: any) => {
        this.emptyArrays();
        this.handleChecklistsResponse(res);
        this.frameService.hideLoader();
        this.frameService.showToastPrime('Success!', 'Successfully Saved Checklists', 'success', 4000);
      },
      error => {
        this.frameService.hideLoader();
        this.frameService.showToastPrime('Error!', 'An error ocurred while saving the checklists.', 'error', 4000);
      }
    );
  }

  areFormsValid() {
    let formsValidationResult = {
      areAllFormsValid: true,
      formErrorMessage: ''
    }

    let moduleSectionsLength = this.checklistForms.controls.length;
    let tabSectionsLength = this.checklistFormsOnTabs.controls.length;
    let formsErrorMessage = '<b>*Module Sections with errors:</b> \n';
    let errorNumOnModuleSections = 0;
    let errorNumOnTabSections = 0;
    for (let i = 0; i < moduleSectionsLength; i++) {
      let formGroup = this.checklistForms.controls[i];
      if (!formGroup.valid) {
        errorNumOnModuleSections++;
        formsErrorMessage += `${i + 1}. ` + this.sectionsOnModules[i].SectionName + ' ' + '\n';
      }
    }
    if (errorNumOnModuleSections == 0) {
      formsErrorMessage += 'N/A \n';
    }
    formsErrorMessage += '<b>*Tab Sections with errors:</b> \n';
    for (let i = 0; i < tabSectionsLength; i++) {
      let formGroup = this.checklistFormsOnTabs.controls[i];
      if (!formGroup.valid) {
        errorNumOnTabSections++;
        formsErrorMessage = formsErrorMessage + `${i + 1}. ` + this.sectionsOnTabs[i].SectionName + ' ' + '\n';
      }
    }
    if (errorNumOnTabSections == 0) {
      formsErrorMessage += 'N/A \n';
    }
    if (errorNumOnModuleSections || errorNumOnTabSections) {
      formsValidationResult.areAllFormsValid = false;
      formsValidationResult.formErrorMessage = formsErrorMessage;
    }

    return formsValidationResult;
  }
}
