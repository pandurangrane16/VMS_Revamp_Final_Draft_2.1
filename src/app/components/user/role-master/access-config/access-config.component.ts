import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { SelectionModel } from '@angular/cdk/collections';
import { UserFacadeService } from 'src/app/facade/facade_services/user-facade.service';
import { ToastrService } from 'ngx-toastr';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { RoleMenuAccess } from 'src/app/models/user/RoleMenuAccess';
import { Globals } from 'src/app/utils/global';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-access-config',
  templateUrl: './access-config.component.html',
  styleUrls: ['./access-config.component.css']
})
export class AccessConfigComponent implements OnInit {

  selectedItems!: any[];
  savedItems!: any[];
  select_all = false;
  data: any[] = [];
  selection = new SelectionModel<Element>(true, []);
  @Input() selectedRole: any;
  @ViewChild(DataTableDirective)
  datatableElement!: DataTableDirective;
  dtOptions: any = {};
  _role: any;
  constructor(
    private _userFacade: UserFacadeService,
    private toastr: ToastrService,
    private _commonFacade: CommonFacadeService,
    private global: Globals,
    public router: Router,
    private ngModal: NgbModal
  ) { }


  ngOnInit(): void {
    this._role = this._commonFacade.getSession("Role");
    this.getMenuData();
  }

  onSelectAll(e: any): void {
    for (let i = 0; i < this.data.length; i++) {
      const item = this.data[i];
      if (item.menuPath != '/dashboard' && item.menuPath != '/map-view') {
        item.is_selected = e;
        if (e == false) {
          item.is_disabled = true;
          item.is_addselected = e;
          item.is_updselected = e;
          item.is_delselected = e;
        }
        else {
          item.is_disabled = false;
        }
      }
    }
  }
  onSingleSelectAll(e: any, data: any) {
    //if(e == true)
    if (data.menuPath != '/dashboard' && data.menuPath != '/map-view') {
      data.is_disabled = false
      data.is_allSelected = e;
      data.is_addselected = e;
      data.is_updselected = e;
      data.is_delselected = e;
    }
  }
  onSelectAccessAll(e: any, data: any) {
    if (data.menuPath != '/dashboard' && data.menuPath != '/map-view') {
      data.is_addselected = e;
      data.is_updselected = e;
      data.is_delselected = e;
    }
  }
  onSelectAccess(e: any, data: any, type: string) {
    if (data.is_addselected == true && data.is_updselected == true && data.is_delselected == true)
      data.is_allSelected = true;
    else
      data.is_allSelected = false;
  }
  removeSelectedRows() {
    this.data.forEach(item => {
      let index: number = this.data.findIndex(d => d === item);
      console.log(this.data.findIndex(d => d === item));
      this.data.splice(index, 1);

    });
    this.selection = new SelectionModel<Element>(true, []);
  }

  public saveSelectedItem() {
    // this.data = this.data.filter(item => this.selectedItems.
    //   findIndex(value => item.data === value.data) === -1);
    // this.savedItems = [...this.selectedItems.map(item => ({ value: item.data }))];


    this.selectedItems = [];
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].is_selected) {
        this.selectedItems.push(this.data[i]);
      }
    }

    this.data = this.data.filter((el) => !this.selectedItems.includes(el));
    console.log(this.selectedItems);
    console.log(this.data);
  }

  getMenuData() {
    this._userFacade.getMenus().subscribe(res => {
      if (res != null && res.length > 0) {
        res.forEach((ele: any) => {
          ele.is_disabled = true;
          ele.is_addselected = false;
          ele.is_updselected = false;
          ele.is_delselected = false;
          if (ele.menuPath == '/dashboard' || ele.menuPath == '/map-view') {
            ele.is_Alldisabled = true;
            ele.is_disabled = true;
            ele.is_allSelected = true;
            ele.is_selected = true;
            ele.is_addselected = true;
            ele.is_updselected = true;
            ele.is_delselected = true;
          }
        });
        this.data = res;
        this.getRoleMenuAccess();
      }
      else {
        this.toastr.error("Something went wrong.", "Error", { positionClass: "toast-bottom-right" });
      }
    })
  }

  getRoleMenuAccess() {
    if (this.selectedRole != "" && this.selectedRole != undefined)
      this._userFacade.getRoleMenuAccess(this.selectedRole).subscribe(res => {
        if (res != null && res != undefined && res.length > 0) {
          res.forEach((ele: any) => {
            let menuIdx = this.data.findIndex(x => x.id == ele.menuId);
            if (ele.checkedAdd == true)
              this.data[menuIdx].is_addselected = true;
            if (ele.checkedUpd == true)
              this.data[menuIdx].is_updselected = true;
            if (ele.checkedDel == true)
              this.data[menuIdx].is_delselected = true;
          });
        }
      })
  }


  SubmitActionConfig() {
    let roleAccess: RoleMenuAccess[] = [];
    this.data.forEach(ele => {
      var role = new RoleMenuAccess();
      role.checkedAdd = ele.is_addselected;
      role.checkedDel = ele.is_delselected;
      role.checkedUpd = ele.is_updselected;
      role.createdby = this.global.UserCode;
      role.id = 0;
      role.menuId = ele.id;
      role.roleId = this.selectedRole;
      roleAccess.push(role);
    });
    this._userFacade.updateRoleAccess(roleAccess).subscribe(res => {
      if (res != 0) {
        this.toastr.success("Saved successfully.");
        this.ngModal.dismissAll();
        this.router.navigate(['users/role-master']);
      }
      else {
        this.toastr.error("Something went wrong", "Error", { positionClass: "toats-bottom-right" });
      }
    }, (err) => {
      console.log(err);
      this.toastr.error("Contact System administrator.", "Error", { positionClass: "toats-bottom-right" });
    })
  }
  CancelAction() {
    this.ngModal.dismissAll();
  }
}
