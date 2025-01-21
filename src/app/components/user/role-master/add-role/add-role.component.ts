import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { UserFacadeService } from 'src/app/facade/facade_services/user-facade.service';
import { RoleMaster } from 'src/app/models/user/RoleMaster';
import { Globals } from 'src/app/utils/global';
import { getErrorMsg } from 'src/app/utils/utils';
import { AccessConfigComponent } from '../access-config/access-config.component';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
  isEdit: boolean = false;
  form: any = [];
  active: boolean = false;
  loading: boolean = false;
  submitting: boolean = false;
  id: number = 0;
  selectedRole: number = 0;
  constructor(private router: Router,
    private global: Globals,
    private formBuilder: FormBuilder,
    private _common: CommonFacadeService,
    private toast: ToastrService,
    private userFacade: UserFacadeService,
    private ngModal: NgbModal,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.global.CurrentPage = "Add Role";
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
      roleName: ['', [Validators.required, Validators.pattern("^[A-Za-z][A-Za-z ]*$")]],
      description: ['', [Validators.required, Validators.pattern("[A-Za-z][A-Za-z ]*$")]],
      isActive: [false, [Validators.required]],
    });
  }

  FillForm(data: any) {
    if (data != null) {
      this.isEdit = true;
      this.selectedRole = data.id;
      this.global.CurrentPage = "Edit Role";
      this.id = data.id;
      if (data.isActive == "Active")
        this.active = true;
      else
        this.active = false;
      this.form.setValue({
        roleName: data.roleName,
        description: data.description,
        isActive: data.isActive
      })
    }
  }
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }

  clearForm() {
    this.id = 0;
    this.isEdit = false;
    this.global.CurrentPage = "Add Role";
    this.form.reset();
    this.form.controls["isActive"].setValue(false);
  }
  BackToList() {
    this.router.navigate(['users/role-master']);
  }

  onSubmit() {
    this.SaveData(0);
  }
  SaveData(type: number) {
    let _roleData = new RoleMaster();
    if (this.id != 0)
      _roleData.id = this.id;
    _roleData.roleName = this.form.controls.roleName.value;
    _roleData.description = this.form.controls.description.value;
    _roleData.createdBy = this.global.UserCode;
    _roleData.isActive = this.active;
    if (type == 1)
      _roleData.isDeleted = true;
    if (this.id != 0) {
      this.userFacade.updateRoles(_roleData).subscribe(r => {
        if (r == 0) {
          this.toast.error("Error occured while saving data");
        } else if (r == -1) {
          this.toast.error("Role name already in used.");
        }
        else {
          this.toast.success("Updated successfully.");
          if (type == 1)
            this.BackToList();
          //this.clearForm();
        }
      })
    }
    else {
      this.userFacade.addRoles(_roleData).subscribe(r => {
        if (r == 0) {
          this.toast.error("Error occured while saving data");
        } else if (r == -1) {
          this.toast.error("Role name already in used.");
        } else {
          this.toast.success("Saved successfully.");
          this.isEdit = true;
          this.global.CurrentPage = "Edit Role";
          this.selectedRole = r;
          //this.clearForm();
        }
      })
    }
  }
  goToAccessConfig() {
    const modalRef = this.ngModal.open(AccessConfigComponent, { windowClass: 'rounded-7', size: 'xl' });
    modalRef.componentInstance.selectedRole = this.selectedRole;
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
      }
    });
  }
  removeRole() {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to remove this role... ?')
      .then((confirmed) => { if (confirmed == true) this.RemoveRole() })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  RemoveRole() {
    this.SaveData(1);
  }
}
