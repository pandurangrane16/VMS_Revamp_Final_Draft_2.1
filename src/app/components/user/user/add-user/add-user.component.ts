import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Globals } from 'src/app/utils/global';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';
import { getErrorMsg } from 'src/app/utils/utils';
import { TarrifMaster } from 'src/app/models/admin/TarrifMaster';
import { UserFacadeService } from 'src/app/facade/facade_services/user-facade.service';
import { InputRequest } from 'src/app/models/request/inputReq';
import { UserMaster } from 'src/app/models/user/UserMaster';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  form: any = [];
  active: boolean = false;
  loading: boolean = false;
  submitting: boolean = false;
  id: number = 0;
  formValidations :any;
  formItems !: FormArray;
  totalAmt !: number;
  selectedRole !: any;
  _request: any = new InputRequest();
  roles: any[] = [];
  constructor(private router: Router,
    private global: Globals,
    private formBuilder: FormBuilder,
    private _facade: UserFacadeService,
    private _common: CommonFacadeService,
    private toast: ToastrService,
    private actRoutes: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService) {
    this.global.CurrentPage = "Add User";
    this.BuildForm();
  }
  ngOnInit(): void {
    this.getRoles();

  }
  get f() { return this.form.controls; }
  BuildForm() {
    this.form = this.formBuilder.group({
      userFName: ['', [Validators.required, Validators.pattern("^[A-Za-z][A-Za-z]*$")]],
      userLName: ['', [Validators.required, Validators.pattern("^[A-Za-z][A-Za-z]*$")]],
      username: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9]*$")]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      roleId: ['', [Validators.required]],
      mobileNo: ['', [Validators.required, Validators.pattern("[0-9]*$")]],
      emailId: ['', [Validators.required, Validators.email]],
      isActive: [false, [Validators.required]],
    });
  }
  FillForm(data: any) {
    if (data != "" && data != null) {

      this.global.CurrentPage = "Edit User";
      this.id = data.id;
      if (data.isActive == "Active")
        this.active = true;
      else
        this.active = false;
      this.selectedRole = data.roleId;
      this.totalAmt = data.totalAmount;
      this.form.setValue({
        userFName: data.userFName,
        userLName: data.userLName,
        username: data.username,
        roleId: this.selectedRole,
        password: data.password,
        confirmPassword: "",
        mobileNo: data.mobileNo,
        emailId: data.emailId,
        isActive: this.active
      })

      this.formValidations = {
        "username" : data.username,
        "mobileno" : data.mobileNo,
        "emailId" :  data.emailId
      }
    }
  }
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }

  getRoles() {
    this._request.currentPage = 0;
    this._request.pageSize = 0;
    this._request.startId = 0;
    this._request.searchItem = "";
    this._facade.getRoles(this._request).subscribe(res => {
      if (res != undefined && res != null) {
        this.roles = res.data;
        let data = this._common.getSession("ModelShow");
        this.FillForm(data == null ? "" : JSON.parse(data));
      }
    })
  }

  onSubmit() {
    this.AddUpdateUser(0);
  }
  clearForm() {
    this.id = 0;
    this.form.reset();
    this.form.controls["isActive"].setValue(false);
  }
  BackToList() {
    this.router.navigate(['users/user-master']);
  }
  DeleteUser() {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to remove this User... ?')
      .then((confirmed) => { if (confirmed == true) this.RemoveUser() })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  RemoveUser() {
    this.AddUpdateUser(1);
  }
  ConfirmPasswordCheck(type: number) {
    let pass = this.form.controls.password.value;
    let confpass = this.form.controls.confirmPassword.value;
    if (pass == confpass || type == 1)
      return true;
    else {
      this.toast.error("Password not matched", "Error", { positionClass: "toast-bottom-right" });
      return false
    };
  }
  AddUpdateUser(type?: any) {
    let v = this.ConfirmPasswordCheck(type);
    console.log(this.form);
    if (v == true) {
      let _usrData = new UserMaster();
      if (this.id != 0)
        _usrData.id = this.id;
      _usrData.userFName = this.form.controls.userFName.value;
      _usrData.userLName = this.form.controls.userLName.value;
      _usrData.username = this.form.controls.username.value;
      _usrData.password = this.form.controls.password.value;
      _usrData.emailId = this.form.controls.emailId.value;
      _usrData.mobileNo = this.form.controls.mobileNo.value;
      _usrData.roleId = this.form.controls.roleId.value;
      _usrData.isActive = this.form.controls.isActive.value;
      _usrData.createdBy = this.global.UserCode;
      if (type == 1)
        _usrData.isDeleted = true;
      if (this.id != 0) {
        this._facade.updateUser(_usrData).subscribe(r => {
          if (r == 0) {
            this.toast.error("Error occured while saving data");
          } else if (r == 4) {
            this.toast.error("Email or Contact number already in use.");
          }
          else {
            this.toast.success("Updated successfully.");
            this.clearForm();
          }
        })
      }
      else {
      //  if (_usrData.id != null && _usrData.id != 0){
      //        this._facade.updateUser(_usrData).subscribe(r => {
      //     if (r == 0) {
      //       this.toast.error("Error occured while saving data");
      //     } else if (r == 4) {
      //       this.toast.error("Email or Contact number already in use.");
      //     } else {
      //       this.toast.success("Saved successfully.");
      //       this.clearForm();
      //     }
      //   })
      //  }
       
          this._facade.addUser(_usrData).subscribe(r => {
          if (r == 0) {
            this.toast.error("Error occured while saving data");
          } else if (r == 4) {
            this.toast.error("Email or Contact number already in use.");
          } else {
            this.toast.success("Saved successfully.");
            this.clearForm();
          }
        })
       
      
        
      }
    }
  }
  CheckMobileNo() {
    let _mobile = this.form.controls["mobileNo"].value;
    if (_mobile.length != 10) {
      this.toast.error("Please enter valid mobile no.");
      this.form.patchValue({ mobileNo: "" });
    }
  }

  ValidateUserName() {
    let username = this.form.controls["username"].value;
    if(this.formValidations != undefined || this.formValidations != null) {
      if(this.formValidations.username.toLocaleLowerCase() != username.toLocaleLowerCase()){
        this.usernamevalidation(username);
      }
    }
    else {
      this.usernamevalidation(username);
    }
  }

  usernamevalidation(username:any){
    this._facade.validateUserName(username).subscribe(res=>{
      if(res == 0) {
        this.toast.error("Username is already in used.");
        this.form.patchValue({
          username : ""
        })
      }
    })
  }
}
