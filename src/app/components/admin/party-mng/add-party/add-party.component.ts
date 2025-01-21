import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';
import { PartyMaster } from 'src/app/models/admin/PartyMaster';
import { Globals } from 'src/app/utils/global';
import { getErrorMsg } from 'src/app/utils/utils';

@Component({
  selector: 'app-add-party',
  templateUrl: './add-party.component.html',
  styleUrls: ['./add-party.component.css']
})
export class AddPartyComponent implements OnInit {
  form: any = [];
  active: boolean = false;
  loading: boolean = false;
  submitting: boolean = false;
  id: number = 0;
  formItems !: FormArray;
  constructor(private router: Router,
    private global: Globals,
    private formBuilder: FormBuilder,
    private _facade: AdminFacadeService,
    private _common: CommonFacadeService,
    private confirmationDialogService:ConfirmationDialogService,
    private toast: ToastrService,
    private actRoutes: ActivatedRoute) {
    this.global.CurrentPage = "Add Party";
    this.BuildForm();
  }
  ngOnInit(): void {
    this.id = 0;
    let data = this._common.getSession("ModelShow");
    this.FillForm(data == null ? "" : JSON.parse(data));
  }
  get f() { return this.form.controls; }
  BuildForm() {
    this.form = this.formBuilder.group({
      partyCode: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9]*$")]],
      partyName: ['', [Validators.required, Validators.pattern("^[A-Za-z][A-Za-z ]*$")]],
      description: ['', [Validators.required,Validators.pattern("[A-Za-z][A-Za-z ]*$")]],
      contactNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10),Validators.minLength(10)]],
      address: ['', [Validators.required,Validators.pattern("[A-Za-z0-9][A-Za-z0-9/-: ]*$")]],
      zipCode: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      gstinNumber: ['', [Validators.required, Validators.pattern("^[A-Za-z0-9]*$")]],
      isActive: [false, [Validators.required]],
    });

  }
  FillForm(data: any) {
    if (data != "") {
      this.id = data.id;
      if (data.isActive == "Active")
        this.active = true;
      else
        this.active = false;
      this.form.setValue({
        partyCode: data.partyCode,
        partyName: data.partyName,
        description: data.description,
        contactNumber: data.contactNo,
        address: data.address,
        zipCode: data.zipCode,
        gstinNumber: data.gstinNo,
        isActive: data.isActive
      })
    }
  }
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }


  onSubmit() {
    let _partyData = new PartyMaster();
    if (this.id != 0)
      _partyData.id = this.id;
    _partyData.partyCode = this.form.controls.partyCode.value;
    _partyData.partyName = this.form.controls.partyName.value;
    _partyData.description = this.form.controls.description.value;
    _partyData.contactNo = this.form.controls.contactNumber.value;
    _partyData.zipCode = this.form.controls.zipCode.value;
    _partyData.address = this.form.controls.address.value;
    _partyData.gstinNo = this.form.controls.gstinNumber.value;
    _partyData.isActive = this.active;
    _partyData.createdBy = this.global.UserCode;
    if (this.id != 0) {
      this._facade.updateParty(_partyData).subscribe(r => {
        if (r == 0) {
          this.toast.error("Error occured while saving data");
        } else {
          this.toast.success("Updated successfully.");
          this.clearForm();
        }
      })
    }
    else {
      this._facade.addParty(_partyData).subscribe(r => {
        if (r == 0) {
          this.toast.error("Error occured while saving data");
        } else {
          this.toast.success("Saved successfully.");
          this.clearForm();
        }
      })
    }
  }
  clearForm() {
    this.id = 0;
    this.form.reset();
    this.form.controls["isActive"].setValue(false);
  }
  BackToList() {
    this.router.navigate(['masters/party-master']);
  }

  DeleteParty() {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to remove this zone... ?')
    .then((confirmed) => {if(confirmed == true) this.RemoveParty()})
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  RemoveParty(){
    this.AddUpdateParty(1);
  }
  AddUpdateParty(type?:any){
    let _partyData = new PartyMaster();
    if (this.id != 0)
    _partyData.id = this.id;
    _partyData.partyCode = this.form.controls.partyCode.value;
    _partyData.partyName = this.form.controls.partyName.value;
    _partyData.description = this.form.controls.description.value;
    _partyData.contactNo = this.form.controls.contactNumber.value;
    _partyData.zipCode = this.form.controls.zipCode.value;
    _partyData.address = this.form.controls.address.value;
    _partyData.gstinNo = this.form.controls.gstinNumber.value;
    _partyData.isActive = this.active;
    _partyData.createdBy = this.global.UserCode;
    if(type == 1)
    _partyData.isDeleted = true;
    if (this.id != 0) {
      this._facade.updateParty(_partyData).subscribe(r => {
        if (r == 0) {
          this.toast.error("Error occured while saving data");
        } else {
          this.toast.success("Updated successfully.");
          this.clearForm();
        }
      })
    }
  }

  ValidateGSTINNumber() {
    let gstInNo = this.form.controls["gstinNumber"].value;
    let regex = new RegExp("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$", "i");
    let match = regex.test(gstInNo);
    if (match) {
        var gstNo = gstInNo;
        if (gstNo != "" && gstNo != undefined && gstNo != null) {
          this._facade.validateGSTINNumber(gstNo,this.id).subscribe(
            (x) => {
              if (x == 0) {
                this.toast.error(
                  "GSTIN Number : " + gstNo + " already in use."
                );
                this.form.patchValue({ gstinNumber: ""});
              } else if (x == 2) {
                this.toast.error("Something went wrong.");
              }
            },
            (err) => {
              this.toast.error(
                "An error occured while handling request, please contact system administrator."
              );
            }
          );
        }
    }
    else {
      this.toast.error("Invalid value in GSTIN number.");
      this.form.patchValue({ gstinNumber: ""});
    }

  }
}
