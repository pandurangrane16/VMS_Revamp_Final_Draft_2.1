import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { InputRequest } from 'src/app/models/request/inputReq';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';
import { Globals } from 'src/app/utils/global';
import { FontUpload } from 'src/app/models/vcms/font';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';

@Component({
  selector: 'app-font-upload',
  templateUrl: './font-upload.component.html',
  styleUrls: ['./font-upload.component.css']
})

 
  export class FontUploadComponent  {
    
  form: any ;
    submitting = false;
    isActive: boolean = true;
    active: boolean = true;
    selectedFiles: any;
    _inputVmsData: any;
    vmsIds: any[] = [];
    vmsId: any[] = [];
    dropdownSettingsVms: any;
    listOfMediaSet: any;
    startId!: number;
    totalRecords!: number;
    isSearch : boolean = false;
    searchText!: string;
    fontMasterData: any[] = [];
    pager: number = 1;
    totalPages: number = 1;
    changeToShow = false;
    label1: string = "Select Controller";
     _request: any = new InputRequest();
    recordPerPage: number = 0;
    files: File[] = [];
   
    selectedFile: File | null = null;
   constructor(
     // private fb: FormBuilder,
     private global : Globals,
      private _toast: ToastrService,
      private adminFacade: AdminFacadeService,
   private _commonFacade: CommonFacadeService,
      private _router: Router,
      private formBuilder: FormBuilder,
      private toast: ToastrService,
      private confirmationDialogService: ConfirmationDialogService,
     
      private _CVMSfacade: CVMSMediaFacadeServiceService,
      ) 
      
      {
        this.dropdownSettingsVms = {
          singleSelection: false,
          idField: 'value',
          textField: 'displayName',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 5,
          allowSearchFilter: true,
        };
          this.BuildForm();
        
      }

      headerArr = [
        { "Head": "ID", "FieldName": "id", "type": "number" },
        { "Head": "Font Name", "FieldName": "fontName", "type": "string" },
       
      
       
      
        { "Head": "Status", "FieldName": "statusText", "type": "bool" },
      
        { "Head": "Action", "FieldName": "actions", "type": "button" }
      ];
      btnArray: any[] = [{ "name": "Remove", "icon": "icon-trash", "tip": "Click to Remove", "action": "delete","condition": (row: any) => row.status === 1  }];
   
    BuildForm() {
      this.form = this.formBuilder.group({
        fontName: ['', [Validators.required, Validators.maxLength(50)]],
        fontFile: [null, [Validators.required]],
        isActive: [true]
      });
    }
    ngOnInit(): void {
      this.getMediaUploadData();
      this.GetVmsDetails();
    }
  
    GetVmsDetails() {
      this._request.currentPage = this.pager;
      this._request.pageSize = this.recordPerPage;
      this._request.startId = this.startId;
      this._request.searchItem = this.searchText;
  
      this.adminFacade.getVmss(this._request).subscribe(data => {
        if (data != null) {
          this._inputVmsData = [];
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
          this._inputVmsData = _data;

        }
      });
    }
    onFileChange(event: any) {
      const file = event.target.files[0];
      if (file) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (fileExtension !== 'ttf') {
          alert('Only .ttf files are allowed');
          this.form.patchValue({ fontFile: null });
          return;
        }
        this.form.patchValue({ fontFile: file });
      }
    }
    get f() { return this.form.controls; }
    getSelectedVms(eve: any, type: any) {
    
      if (eve.length > 0) {
        if (type == 1) {
          eve.forEach((vms: any) => {
           // this.vmsIds = [];
          
            this.vmsIds.push(vms.value);
          });
        }
        else {
          eve.forEach((ele: any) => {
            var idx = 0;
            this.vmsIds.forEach(element => {
              if (element.value == eve.value) {
                this.vmsIds.splice(idx, 1);
              }
              idx++;
            });
          });
        }
      }
      else if (eve.length == 0)
      this.vmsIds = [];
     
  
      else {
        // let inputVal = eve.value.split('|');
        // let ipaddress = inputVal[0];
        // let vmsid = inputVal[1];
        if (type == 1){
          
            this.vmsIds.push(eve.value);
            
           
         }
        else {
          var idx = 0;
          this.vmsIds.forEach(element => {
            if(element.value != undefined) {
              if (element.value == eve.value) {
                this.vmsIds.splice(idx, 1);
              }
            } else {
              if (element == eve.value) {
                this.vmsIds.splice(idx, 1);
              }
            }
            idx++;
          });
        }
      }
  
    }
    onFileSelected(event: any): void {
      if (event.target.files.length > 0) {
        this.selectedFile = event.target.files[0];
        this.form.patchValue({ fontFile: this.selectedFile });
      }
    }
    onPager(pager: number) {
      this._request.pageSize = this.recordPerPage;
      this.pager = pager;
      this.startId = (this.pager - 1) * this.recordPerPage;
      this.getMediaUploadData();
    }
    onRecordPageChange(recordPerPage: number) {
      this._request.pageSize = recordPerPage;
      this.pager = recordPerPage;
      this.recordPerPage = recordPerPage;
      this.startId = 0;
      this.pager = 1;
      console.log(this.recordPerPage);
      this.getMediaUploadData();
    }
    onPageSearch(search: string) {
      this.isSearch = true;
      this.searchText = search;
      this.getMediaUploadData();
    }
    ButtonAction(actiondata: any) { 
      if (actiondata.action === "delete") {
        this.deleteRecord(actiondata.data);
      }
    }
      deleteRecord(element?: any) {
        this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to remove this media... ?')
        .then((confirmed) => { if (confirmed == true) this.RemovePlaylist(element) })
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
      }
      RemovePlaylist(element?: any) {
        let mediaUploadList: FontUpload[] = [];
         let _vcmsuploadmediadata =new FontUpload();

         _vcmsuploadmediadata.IpAddress = element.ipAddress;
         _vcmsuploadmediadata.VmsId=element.vmsId;
         _vcmsuploadmediadata.status = 0;
         //_vcmsuploadmediadata.createddate = new Date();
         _vcmsuploadmediadata.CreationTime = new Date();
         _vcmsuploadmediadata.RequestType ="/font/deleteFontDetails"
         let requestData2 = JSON.parse(element.requestData); 
     
         let requestData = {
          fontId: element.responseId,

          fontName: requestData2.name
        
        };
        _vcmsuploadmediadata.RequestData = JSON.stringify(requestData);
          // _vcmsuploadmediadata.RequestData = JSON.stringify(_requestTextData);
         
          mediaUploadList.push(_vcmsuploadmediadata);
     
         this._CVMSfacade.AddFontUploadDetails(mediaUploadList).subscribe(data => {
           if (data == 0) {
             this.toast.error("Error occured while Deleting ");
           }
           else {

      this.toast.success("Data deleted successfully");

      const fontName = element.fontName; 
      const isDeleted = true; 

      this._CVMSfacade.UpdateFontMasterStatus(isDeleted, fontName).subscribe(response => {

        if (response == 0) {
          this.toast.error("Font name not found in fontmaster.");
        } 

        else  {
          console.log("Font master status updated successfully", response);
        }
        this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this._router.navigate(['cvms/font-upload']);
         });
       
      }, error => {
        console.error("Error updating font master status", error);
        this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this._router.navigate(['cvms/font-upload']);
         });
        
      }
    );
    
      
           }
         });
       }
    SearchWithId(_searchItem: any) {
      this._commonFacade.setSession("ModelShow", JSON.stringify(_searchItem));
      //this.router.navigate(['masters/add-party']);
    }
    getMediaUploadData() {
      this._request.currentPage = this.pager;
      this._request.pageSize = this.recordPerPage;
      this._request.startId = this.startId;
      this._request.searchItem = this.searchText;
      this.changeToShow = false;
      this._CVMSfacade.GetFontuploaddata(this._request).subscribe(res => {
        if (res != null && res != undefined) {
          this.fontMasterData = res.data; 
          console.log("Stored font master data:", res);
          res.data.forEach((ele: any) => {
            let requestData = ele.requestData ? JSON.parse(ele.requestData) : null;
            ele.fontName = requestData.name;  
            if (ele.status == 0) {
              ele.statusText = "Sent Pending";
             
            }
            else if (ele.status == 1) {
              ele.statusText = "Sent Sucessfull"
              
            }
            else if (ele.status == 2) {
              ele.statusText = "Sent Failed"
              
            }



          });
          this.listOfMediaSet = res.data;
          var _length = res.totalRecords / this.recordPerPage;
          if (_length > Math.floor(_length) && Math.floor(_length) != 0)
            this.totalRecords = this.recordPerPage * (_length);
          else if (Math.floor(_length) == 0)
            this.totalRecords = 10;
          else
            this.totalRecords = res.totalRecords;
          this.totalPages = this.totalRecords / this.pager;
        }
      })
    }
    save(event: any): void {
      this.selectedFiles = event.target.files[0];
      this.files = [];
      //this.message = '';
      //this.show = true;
    
      // Ensure only a single file is selected
      if (event.target.files.length !== 1) {
        this.toast.error("Please select only one file.");
        return;
      }
    
      //this.currentFile = event.target.files[0];
    
      // Validate that the file is a .ttf file
      const file =  this.selectedFiles;
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'ttf') {
        this.toast.error("Only .ttf files are allowed.");
        return;
      }
    
      // Perform any additional validation if needed
      // if (!this.Validations()) {
      //   this.toast.error("File validation failed.");
      //   return;
      // }
      if (event.target.files.length > 0) {
        this.selectedFile = event.target.files[0];
        this.form.patchValue({ fontFile: this.selectedFile });
      }
      // Store the valid file
      this.files.push(file);
    
      this.toast.success("File selected successfully.");
    }
    
    onSubmit(): void {

      this._CVMSfacade.CheckFontName(this.form.value.fontName).subscribe(response => {
        if (!response) {
          this.toast.error("Font name already exists. Please choose a different name.");
          return;
        } else {
          this.toast.success("Font name is available.");
          if (this.form.invalid || !this.selectedFile) {
            this._toast.error("Error occurred while saving data. Please select Input Values.");
            return;
          }
        
          const formData = new FormData();
          
    
          formData.append("FontName", this.form.value.fontName);
          formData.append("CreatedBy", this.global.UserCode);
          formData.append("IsActive", this.form.value.isActive ? "true" : "false");
          formData.append("files", this.selectedFile, this.selectedFile.name);
    
          
          this._CVMSfacade.AddFontDetails(formData).pipe(
            catchError((err) => {
              this._toast.error("Error occurred while saving data: " + err);
              throw err;
            })
          ).subscribe(data => {
            if (data == 0) {
              this._toast.error("Error occurred while saving data for " + this.form.value.fontName);
            } else {
              this._toast.success("Saved successfully for " + this.form.value.fontName);
    
              let mediaUploadList: FontUpload[] = [];
    
         for (let i = 0; i < this.vmsIds.length; i++) {
        let _vcmsuploadmediadata = new FontUpload();
    
    
         let inputVal = this.vmsIds[i].split('|');
         let ipaddress = inputVal[0];
         let vmsid = inputVal[1];
    
       
        
        _vcmsuploadmediadata.VmsId = Number.parseInt(vmsid); // Corresponding VMS ID
         _vcmsuploadmediadata.IpAddress=ipaddress;
       
        _vcmsuploadmediadata.status = 0;
      
        
        _vcmsuploadmediadata.CreationTime = new Date();
        _vcmsuploadmediadata.RequestType = "/font/fontUpload";
        console.log(this.selectedFile)
        //console.log(this.selectedFile?.name)
        let _requestTextData;
        _requestTextData = {
          name: this.form.value.fontName,
          id: 0,
          file: this.selectedFile?.name
          
        };
        _vcmsuploadmediadata.RequestData = JSON.stringify(_requestTextData);
    
        // Add the object to the list
        mediaUploadList.push(_vcmsuploadmediadata);
        console.log("List of media uploads:", mediaUploadList);
    
    }
      this._CVMSfacade.AddFontUploadDetails(mediaUploadList).subscribe(
        (response) => {
          if (response == 0) {
            this.toast.error("Error occurred while saving media data.");
          } else {
            this.toast.success("Font saved successfully .");
          }
        },
        (error) => {
          this.toast.error("Error occurred while saving to fontuploadcvms.");
        }
      );
              this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this._router.navigate(['cvms/font-upload']);
              });
            }
          });

        }
      }, error => {
        console.error("Error checking font name", error);
        this.toast.error("Error checking font name availability.");

      });



    }
    
    // onSubmit() {
    //   if (this.form.invalid) {
    //     return;
    //   }
    //   this.submitting = true;
    //   const formData = new FormData();
    //   formData.append('fontName', this.form.get('fontName')?.value);
    //   formData.append('fontFile', this.form.get('fontFile')?.value);
    //   formData.append('isActive', this.form.get('isActive')?.value);
  
    //   // Simulate API call
    //   setTimeout(() => {
    //     console.log('Form Submitted', formData);
    //     this.submitting = false;
    //     alert('Font uploaded successfully');
    //   }, 2000);
    // }
  }
  

