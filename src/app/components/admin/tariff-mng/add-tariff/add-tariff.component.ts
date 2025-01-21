import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';
import { TarrifMaster } from 'src/app/models/admin/TarrifMaster';
import { Globals } from 'src/app/utils/global';
import { getErrorMsg } from 'src/app/utils/utils';

@Component({
  selector: 'app-add-tariff',
  templateUrl: './add-tariff.component.html',
  styleUrls: ['./add-tariff.component.css']
})
export class AddTariffComponent {
  form: any = [];
  active: boolean = false;
  loading: boolean = false;
  submitting: boolean = false;
  id: number = 0;
  formItems !: FormArray;
  totalAmt !: number;
  selectedUOM: any = "0";
  constructor(private router: Router,
    private global: Globals,
    private formBuilder: FormBuilder,
    private _facade: AdminFacadeService,
    private _common: CommonFacadeService,
    private toast: ToastrService,
    private actRoutes: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService) {
    this.global.CurrentPage = "Add Tarrif";
    this.BuildForm();
  }
  ngOnInit(): void {
    this.id = 0;
    let data = this._common.getSession("ModelShow");
    this.selectedUOM = "0";
    this.FillForm(data == null ? "" : JSON.parse(data));
    
  }
  get f() { return this.form.controls; }
  BuildForm() {
    this.form = this.formBuilder.group({
      tarrifCode: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9]*$")]],
      tarrifType: ['', [Validators.required, Validators.pattern("^[A-Za-z][A-Za-z ]*$")]],
      uomName: ['0'],
      amount: ['', [Validators.required, Validators.pattern("^[0-9.]*$")]],
      gstPer: ['', [Validators.required, Validators.pattern("[0-9.]*$")]],
      totalAmount: ['', [Validators.required]],
      isActive: [false, [Validators.required]],
    });
    this.form.get('totalAmount').disable();
  }
  ChangeTotalAmount() {
    let _amount = this.form.controls["amount"].value;
    let _gst = this.form.controls["gstPer"].value;
    let _tax = (_amount / 100) * _gst;
    this.totalAmt = Number(_amount) + Number(_tax);
  }
  FillForm(data: any) {
    if (data != "") {
      this.id = data.id;
      if (data.isActive == "Active")
        this.active = true;
      else
        this.active = false;
      let uom = "";
      if (data.uomName == "second")
        uom = "Second Wise";
      if (data.uomName == "minute")
        uom = "Minute Wise";
      if (data.uomName == "hour")
        uom = "Hourly";
      this.selectedUOM = data.uomName;
      this.totalAmt = data.totalAmount;
      this.form.setValue({
        tarrifCode: data.tarrifCode,
        tarrifType: data.tarrifType,
        uomName: data.uomName,
        amount: data.amount,
        gstPer: data.gstPer,
        totalAmount: data.totalAmount,
        isActive: data.isActive
      })
    }
  }
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }


  onSubmit() {
    this.AddUpdateTarrif(0);
  }
  clearForm() {
    this.id = 0;
    this.form.reset();
    this.form.controls["isActive"].setValue(false);
  }
  BackToList() {
    this.router.navigate(['masters/tarrif-master']);
  }
  DeleteTarrif() {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to remove this tarrif... ?')
      .then((confirmed) => { if (confirmed == true) this.RemoveTarrif() })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  RemoveTarrif() {
    this.AddUpdateTarrif(1);
  }
  ValidateTarrifCode() {
    let trfCode = this.form.controls.tarrifCode.value;
    if(this.id == 0) {
      this._facade.ValidateTarrifCode(trfCode).subscribe(res => {
        if (res == 0) {
          this.toast.error("Tarrif Code already in use.");
          this.form.patchValue({ tarrifCode: "" });
        }
      })
    }
  }
  AddUpdateTarrif(type?: any) {
    let _trfData = new TarrifMaster();
    if (this.id != 0)
      _trfData.id = this.id;
    _trfData.tarrifCode = this.form.controls.tarrifCode.value;
    _trfData.tarrifType = this.form.controls.tarrifType.value;
    _trfData.uomName = this.form.controls.uomName.value;
    _trfData.amount = this.form.controls.amount.value;
    _trfData.gstPer = this.form.controls.gstPer.value;
    _trfData.totalAmount = this.form.controls.totalAmount.value;
    _trfData.isActive = this.active;
    _trfData.createdBy = this.global.UserCode;
    if (_trfData.uomName == "0" && type != 1) {
      this.toast.error("Please select Unit of measurement");
    } else {
      if (type == 1)
        _trfData.isDeleted = true;
      if (this.id != 0) {
        this._facade.updateTarrif(_trfData).subscribe(r => {
          if (r == 0) {
            this.toast.error("Error occured while saving data");
          } else {
            this.toast.success("Updated successfully.");
            this.router.navigate(['masters/tarrif-master']);
          }
        })
      }
      else {
        this._facade.addTarrif(_trfData).subscribe(r => {
          if (r == 0) {
            this.toast.error("Error occured while saving data");
          } else {
            this.toast.success("Saved successfully.");
            this.clearForm();
          }
        })
      }
    }

  }
}
