import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { InputRequest } from 'src/app/models/request/inputReq';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';
import { Globals } from 'src/app/utils/global';
import { FontUpload } from 'src/app/models/vcms/font';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { CancelPlay } from 'src/app/models/vcms/cancelplay';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';

@Component({
  selector: 'app-cancel-play',
  templateUrl: './cancel-play.component.html',
  styleUrls: ['./cancel-play.component.css']
})
export class CancelPlayComponent {
 dropdownSettingsVms: any;
 submitting = false;
 form: any ;
  _inputVmsData: any;
   _request: any = new InputRequest();
  vmsIds: any[] = [];
  vmsId: any[] = [];
  selectedVms: any[] = []; 
   SelectedControllerId: any;
    inputVmsData: any;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  listOfMediaSet: any;
  totalPages: number = 1;
  isSearch : boolean = false;
  pager: number = 1;
  changeToShow = false;
  searchText!: string;
  headerArr = [
       
        { "Head": "IP Address", "FieldName": "ipAddress", "type": "string" },
        { "Head": "Creation Time", "FieldName": "creationTime", "type": "string" },
        { "Head": "Status", "FieldName": "statusText", "type": "bool" },
        { "Head": "Action", "FieldName": "actions", "type": "button" }
      ];
        btnArray: any[] = [
        { 
          "name": "Error", 
          "icon": "icon-cross",  
          "tip": "View Error Message", 
          "action": "error", 
          "condition": (row: any) => row.status === 2 || row.status === 0
        }
      ];
  label1: string = "Select Controller";
   constructor(
      // private fb: FormBuilder,
       private global : Globals,
       private _toast: ToastrService,
       private adminFacade: AdminFacadeService,
       private _commonFacade: CommonFacadeService,
       private _router: Router,
       private formBuilder: FormBuilder,
       private toast: ToastrService,
       private http: HttpClient,
       private confirmationDialogService: ConfirmationDialogService,
      
       private _CVMSfacade: CVMSMediaFacadeServiceService,
       ) 
       {
        this.global.CurrentPage="Cancel Play CVMS";
        this.dropdownSettingsVms = {
          singleSelection: true,
          idField: 'value',
          textField: 'displayName',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 5,
          allowSearchFilter: true,
        };
          this.BuildForm();
      }
          ngOnInit(): void {
      this.GetVmsDetails();
      this.getMediaUploadData();
      
      
    }
 BuildForm() {
  this.form = this.formBuilder.group({
    SelectedControllerId: [null]
  });
}
      onPager(pager: number) {
      this._request.pageSize = Number(this.recordPerPage);
      this.pager = pager;
      this.startId = (this.pager - 1) * Number(this.recordPerPage);
      this.getMediaUploadData();
    }
    //  getSelectedVms(eve: any, type: any) {
    
    //   if (eve.length > 0) {
    //     if (type == 1) {
    //       eve.forEach((vms: any) => {
    //        // this.vmsIds = [];
          
    //         this.vmsIds.push(vms.value);
    //       });
    //     }
    //     else {
    //       eve.forEach((ele: any) => {
    //         var idx = 0;
    //         this.vmsIds.forEach(element => {
    //           if (element.value == eve.value) {
    //             this.vmsIds.splice(idx, 1);
    //           }
    //           idx++;
    //         });
    //       });
    //     }
    //   }
    //   else if (eve.length == 0)
    //   this.vmsIds = [];
     
  
    //   else {
    //     // let inputVal = eve.value.split('|');
    //     // let ipaddress = inputVal[0];
    //     // let vmsid = inputVal[1];
    //     if (type == 1){
          
    //         this.vmsIds.push(eve.value);
            
           
    //      }
    //     else {
    //       var idx = 0;
    //       this.vmsIds.forEach(element => {
    //         if(element.value != undefined) {
    //           if (element.value == eve.value) {
    //             this.vmsIds.splice(idx, 1);
    //           }
    //         } else {
    //           if (element == eve.value) {
    //             this.vmsIds.splice(idx, 1);
    //           }
    //         }
    //         idx++;
    //       });
    //     }
    //   }
  
    // }
     getMediaUploadData() {
      this._request.currentPage = (this.pager-1);
      this._request.pageSize = Number(this.recordPerPage);
      this._request.startId = this.startId;
      this._request.searchItem = this.searchText;
      this.changeToShow = false;
      this._CVMSfacade.CancelPlay(this._request).subscribe(res => {
        if (res != null && res != undefined) {
          //this.fontMasterData = res.data; 
         // console.log("Stored font master data:", res);
          res.data.forEach((ele: any) => {
            //let requestData = ele.requestData ? JSON.parse(ele.requestData) : null;
            //ele.fontName = requestData.name;  
            if(ele.status == 2)
              {    const parsedData2 = JSON.parse(ele.response);
              const message= parsedData2.message;
              ele.ErrorMessage=message;}
          
            if (ele.status == 0) {
              ele.statusText = "Sent Failed";
             
            }
            else if (ele.status == 1) {
              ele.statusText = "Sent Sucessfull"
              
            }
            else if (ele.status == 2) {
              ele.statusText = "Sent Failed"
              
            }

            ele.ipaddress=ele.ipAddress;
            ele.creationTime=ele.creationTime;
            



          });
          this.listOfMediaSet = res.data;
          var _length = res.totalRecords / Number(this.recordPerPage);
          if (_length > Math.floor(_length) && Math.floor(_length) != 0)
            this.totalRecords = Number(this.recordPerPage) * (_length);
          else if (Math.floor(_length) == 0)
            this.totalRecords = 10;
          else
            this.totalRecords = res.totalRecords;
          this.totalPages = this.totalRecords / this.pager;
        }
      })
    }
onSubmit(): void {

   if (this.SelectedControllerId == undefined || this.SelectedControllerId.length < 1) {
      this._toast.error("No controller selected. Please select one controller to proceed.");
      return;
    }
  else{
    
    
    let _vmsIpAdd = this.SelectedControllerId[0];
    //let mediaUploadList: CancelPlay[] = [];

 
    let _vcmsuploadmediadata = new CancelPlay();

   

    _vcmsuploadmediadata.vmsId = Number.parseInt(this.SelectedControllerId[1]);
    _vcmsuploadmediadata.ipAddress = _vmsIpAdd;
    _vcmsuploadmediadata.status = 0;
    _vcmsuploadmediadata.creationTime = new Date();

    //mediaUploadList.push(_vcmsuploadmediadata);
  

 
    this._CVMSfacade.PostPlayCancel(_vcmsuploadmediadata).subscribe({
      next: (res) => {
        if (res === 1) {
          
          console.log(`Successfully cancelled playing Media.`);
          this.toast.success(`Successfully cancelled playing Media.`)

        } else {
          console.warn(`Received unexpected response:`, res);
          this.toast.success(`Received unexpected response:`, res)
        }

         this.getMediaUploadData();
      },
      error: (err) => {
        console.error(`Failed to save`, err);
        this.toast.error(`Failed to save`, err);
      
      }
    });
  ;
  
  }
 console.log("Before reset:", this.SelectedControllerId);
this.SelectedControllerId = null;
this.form.get('SelectedControllerId')?.setValue(null);
console.log("After reset:", this.SelectedControllerId);
}



     onRecordPageChange(recordPerPage: number) {
      this._request.pageSize =Number(recordPerPage);
      this.pager = Number(recordPerPage);
      this.recordPerPage = Number(recordPerPage);
      this.startId = 0;
      this.pager = 1;
      console.log(this.recordPerPage);
      this.getMediaUploadData();
    }
      getSelectedVms(eve: any) {
    const selectElement = eve.target as HTMLSelectElement;
    const colindex = selectElement.value.indexOf(":");
    if (colindex !== -1) {
      this.SelectedControllerId = selectElement.value.slice(colindex + 1, selectElement.value.length).replace(/\s+/g, '').split("|");
       let _vmsIpAdd = this.SelectedControllerId[0];
       console.log(_vmsIpAdd)
    }
  }
    GetVmsDetails() {

    this.adminFacade.getVmss(this._request).subscribe(data => {
      if (data != null) {
        let commonList: CommonSelectList[] = [];
        data.data.forEach((ele: any) => {
          if (ele.vmdType == 2) {
            var _commonSelect = new CommonSelectList();
            _commonSelect.displayName = ele.description;
            _commonSelect.value = ele.ipAddress + "|" + ele.id;
            commonList.push(_commonSelect);
          }
        });
        let _data = {
          data: commonList,
          disabled: false
        }
        this.inputVmsData = _data;
      }
    });
  }

      SearchWithId(_searchItem: any) {
      this._commonFacade.setSession("ModelShow", JSON.stringify(_searchItem));
      //this.router.navigate(['masters/add-party']);
    }

        ButtonAction(actiondata: any) { 
      if (actiondata.action === "delete") {
        //this.deleteRecord(actiondata.data);
      }
      if (actiondata.action === "error") {
        this.Show_error(actiondata.data);
      }
    }

        Show_error(element?: any) {
      if (!element || !element.response) {
        console.log(element)
          this.confirmationDialogService
          .confirm('Error Message',  "No message field in response.")
          .catch(() => {}); 
        return;
      }
    
      try {
        const responseObj = JSON.parse(element.response);
        const message = responseObj.message || "No message field in response.";
      
        this.confirmationDialogService
          .confirm('Error Message', message)
          .catch(() => {}); 
      } catch (err) {
        this.confirmationDialogService
          .confirm('Error', 'Failed to parse error message.')
          .catch(() => {});
      }
    
    }
     onPageSearch(search: string) {
      this.isSearch = true;
      this.searchText = search;
      this.getMediaUploadData();
    }

 
}
