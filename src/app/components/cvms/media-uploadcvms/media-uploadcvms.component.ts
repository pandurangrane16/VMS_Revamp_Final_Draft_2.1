import { booleanAttribute, Component, OnInit, Pipe, PipeTransform, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { getErrorMsg } from 'src/app/utils/utils';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Vcmsuploadmedia } from 'src/app/models/vcms/vcmsuploadmedia';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { DateTimeModel } from 'src/app/models/DateTimeModel';
import { ToastrService } from 'ngx-toastr';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';
import { date, even, json } from '@rxweb/reactive-form-validators';
import { _ } from 'core-js';
import { data } from 'jquery';
import { turn } from 'core-js/core/array';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';
import { check } from 'ngx-bootstrap-icons';
import { FileServiceService } from 'src/app/facade/services/vcms/file-service.service';
import { mediaAudit } from 'src/app/models/media/PlaylistMaster';
import { Globals } from 'src/app/utils/global';
import { catchError } from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

declare var $: any;
@Component({
  selector: 'app-media-uploadcvms',
  templateUrl: './media-uploadcvms.component.html',
  styleUrls: ['./media-uploadcvms.component.css']
})
export class MediaUploadcvmsComponent implements OnInit {
  MediaSearch:string="";
  form: any = [];
  _request: any = new InputRequest();
  active: boolean = false;
  loading: boolean = false;
  submitting: boolean = false;
  formValidations: any;
  formItems !: FormArray;
  medias: any[] = [];
  FileTypes: any;
  mediatype: string;
  isFileTypeText: boolean = false;
  isFileTypeImage: boolean = false;
  isFileTypeURL: boolean = false;
  RequestData: JSON;
  label1: string = "Select Controller";
  vmsIds: any[] = [];
  _configData:any;
  vmsId: any[] = [];
  default_dropdownSettingsVms: any;
  dropdownSettingsVms: any;
  _inputVmsData: any;
  _inputPlayerData: any = [];
  changeToShow = false;
  pager: number = 0;
  recordPerPage: number = 0;
  startId: number = 0;
  searchText: string = "";
  filterVms: any;
  page: any;
  listOfMedialist: any;
  listOfSearchMedialist: any;
  totalPages: number = 1;
  totalRecords!: number;
  closeResult!: string;
  isSearch: boolean = false;
  selectedMedia: any[] = [];
  fontList: string[] = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia'];

  selectedIds: number[] = [];
  url: string = "";
  fileTypes: any;
  format: string = "";
  fileName: string = "";
  MediaName: string = "";


  get f() { return this.form.controls; }

  constructor(private adminFacade: AdminFacadeService,
    private _CVMSfacade: CVMSMediaFacadeServiceService,
    private fileService: FileServiceService,
    private _media: MediaFacadeService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    public _commonFacade: CommonFacadeService,
    public _router: Router,
    private global: Globals,
  ) {
    this.default_dropdownSettingsVms = {
      singleSelection: false,
      idField: 'value',
      textField: 'displayName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };
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
    this._CVMSfacade.getKeysDataForConfig("fileTypes").subscribe((data2: any) => {
      console.log("Data received:", data2); // Check the structure of the received data
      this.FileTypes = data2.fileTypes; // Extract fileTypes if it's inside an object
      console.log("FileTypes:", this.FileTypes);
    });
    
    //this.FileTypes = this.getFileType();
    //getKeysDataForConfig
    this.global.CurrentPage = "Media Upload CVMS";
  }


  BuildForm() {
    this.form = this.formBuilder.group({
      //MediaTextName: ['', [Validators.required, Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$")]],
      //MediaTextName: ['', [Validators.required, Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$")]],
      MediaFileName: ['', ''],
      MediaTextName: ['', ''],
      FontName:['',''],
      mediaName: ['', ''],
      //mediaName: ['', [Validators.required,Validators.maxLength(30) ,Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$")]],
      mediatype: ['', ''],
      MediaSearch:['',''],
    });

    this.form.get('mediatype')?.valueChanges.subscribe((Method: any) => {
      this.UpdateValidations(Method);
    })
  }

  ngOnInit(): void {
    this.GetVmsDetails();
    this.getMedialistData();
    
  }

  BacktoList() {
    this._router.navigate(['cvms/uploadMedia']);
  }

  UpdateValidations(method: string) {

    const MediaName = this.form.get('mediaName')
    const MediaTextName = this.form.get('MediaTextName')

    if (method == 'text') {
      MediaName?.setValidators([Validators.required, this.noLeadingEndingWhitespace]);
      MediaTextName?.setValidators([Validators.required, this.noLeadingEndingWhitespace]);
    }
    else {
      MediaName?.clearValidators();
      MediaTextName?.clearValidators();
    }

    MediaName?.updateValueAndValidity();
    MediaTextName?.updateValueAndValidity();
  }
  getMediaUploadData() {
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId;
    this._request.searchItem =this.vmsIds[0].split('|')[0];
    this.changeToShow = false;
    this._CVMSfacade.GetFontupload_font(this._request).subscribe(res => {
      if (res.data != null) {
        if (res.data.length > 0) {
          let commonList: CommonSelectList[] = [];
          res.data.forEach((ele: any) => {
            let _responseId = ele.responseId;
            let _data = JSON.parse(ele.requestData);
            var _commonSelect = new CommonSelectList();
            _commonSelect.displayName = _data.name;
            _commonSelect.value = _responseId;
            commonList.push(_commonSelect);
          });
          let _data = {
            data: commonList,
            disabled: false
          }
          this._inputPlayerData = _data;

         
          
       

        }
      }
    })
   
  }
  onSubmit() {
    if (this.vmsIds== undefined || this.vmsIds.length < 1) {
      this.toast.error("Controller not selected. Please select at least one controller to proceed.");
      return;
    }
    if (this.isFileTypeImage) {
      if (this.selectedIds.length < 1) {
        this.toast.error("Media/Text not selected.Please select at least one Media/Text to proceed.");
        return;
      }
    }

    for (let i = 0; i < this.vmsIds.length; i++) {
      const element = this.vmsIds[i].split('|');
      if (this.isFileTypeImage) {
        for (let j = 0; j < this.selectedIds.length; j++) {
          const media = this.selectedMedia[j];
          this.AddUpdateMedia(element[0], media, element[1]);
        }
      } 
      // if (this.isFileTypeURL){
      //   this._CVMSfacade.CheckDuplicateMediaName(this.form.controls.mediaName.value, this.vmsIds[i]).pipe(catchError((error) => {
      //     this.toast.error("Error occured while checking duplicate Media name " + error);
      //     throw error;
      //   })).subscribe(data => {
      //     if (data) {
      //       this.toast.error("Media Name is Duplicate. Please set Different Name.");
      //       return;
      //     }
      //     else {

      //       this.AddUpdateMedia(element, null, this.vmsId[i]);
      //     }
      //   })
      // }
      else {
        this._CVMSfacade.CheckDuplicateMediaName(this.form.controls.mediaName.value,this.vmsIds[i].split('|')[0]).pipe(catchError((error) => {
          this.toast.error("Error occured while checking duplicate Media name " + error);
          throw error;
        })).subscribe(data => {
          if (data) {
            this.toast.error("Media Name is Duplicate. Please set Different Name.");
            return;
          }
          else {

            this.AddUpdateMedia(element[0], null, element[1]);
          }
        })
      }
    }
  }
  

  AddUpdateMedia(element?: any, media?: any, vmsId?: any ) {
    let _vcmsuploadmediadata = new Vcmsuploadmedia();
    _vcmsuploadmediadata.controllerName = element;
    _vcmsuploadmediadata.IpAddress = element;
    _vcmsuploadmediadata.VmsId = Number.parseInt(vmsId);
    if (media != null) {
      _vcmsuploadmediadata.medianame = media.displayName;
    }
    else {
      _vcmsuploadmediadata.medianame = this.form.controls.mediaName.value;
    }

    _vcmsuploadmediadata.status = 0;
    _vcmsuploadmediadata.AuditedBy = "System";
    _vcmsuploadmediadata.IsAudited = true;
    _vcmsuploadmediadata.AuditedTime = new Date();
    _vcmsuploadmediadata.Reason = "Upload Data for test";
    _vcmsuploadmediadata.CreationTime = new Date();
    _vcmsuploadmediadata.requesttype ="/media/uploadMedia"

    if (this.isFileTypeText) {
      let _requestTextData = {
        type: this.form.controls.mediatype.value,
        id: 0,
        name: this.form.controls.mediaName.value,
        text: this.form.controls.MediaTextName.value,
        //fontId:this.form.controls.fontName.value,
        fontId:this.form.controls["FontName"].value,


      }
      _vcmsuploadmediadata.RequestData = JSON.stringify(_requestTextData);
    }
    else if (this.isFileTypeURL) {
      let _requestTextData = {
        type: "text",
        id: 0,
        name: this.form.controls.mediaName.value,
        text: this.form.controls.MediaTextName.value
      }
      _vcmsuploadmediadata.RequestData = JSON.stringify(_requestTextData);
    }
    else {
      let _requestTextData = {
        type: this.form.controls.mediatype.value,
        id: media.id,
        name: this.extractFileName(media.fileName),
        file: media.uploadSetId + '/' + media.fileName
      }
      _vcmsuploadmediadata.RequestData = JSON.stringify(_requestTextData);
    }


    this._CVMSfacade.SaveMediaUpload(_vcmsuploadmediadata).subscribe(data => {
      if (data == 0) {
        this.toast.error("Error occured while saving data for " + _vcmsuploadmediadata.controllerName);
      }
      else {
        this.toast.success("Saved successfully for " + _vcmsuploadmediadata.controllerName);
        this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this._router.navigate(['cvms/uploadMedia']);
        });
      }
    });
  }

  // getFileType() {
  //   return this._config.fileTypes
  // }
  onCheckBoxChange(event: any, data: any): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedIds.push(data.id);
      this.selectedMedia.push(data);
    }
    else {
      const index = this.selectedIds.indexOf(data.id);
      const index1 = this.selectedMedia.indexOf(data.id);
      if (index > -1) {
        this.selectedIds.splice(index, 1);
        this.selectedMedia.splice(index1, 1);
      }
    }

  }

  ButtonAction(actiondata: any) {
    if (actiondata.action == 'view') {
      this._commonFacade.setSession("playlistData", JSON.stringify(actiondata.data));
      this._router.navigate(['medias/playlist-configure'], { queryParams: { isCopy: false, status: actiondata.data.status, plid: actiondata.data.plid } });
    }

  }
  getMedialistData() {
    this._media.getAllMediaDetails().subscribe(res => {
      if (res != null && res.length > 0) {
        this.listOfMedialist = res;
        this.listOfSearchMedialist = res;
      }
      else
        this.toast.error("Failed to failed media details.", "Error", { positionClass: "toast-bottom-right" });
    }, (err) => { console.log(err) });
  }

  onUploadTypeChange(value: any) {

    if (this.mediatype == 'text') {
      this.isFileTypeText = true;
      this.isFileTypeImage = false;
      this.isFileTypeURL = false;
      this.dropdownSettingsVms={
      singleSelection: true,
      idField: 'value',
      textField: 'displayName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,

      };
    }
    if (this.mediatype == 'URL') {
      this.isFileTypeURL = true;
      this.isFileTypeImage = false;
      this.isFileTypeText = false;
      this.dropdownSettingsVms=this.default_dropdownSettingsVms;
    }

    if(this.mediatype == 'media')  {
      this.isFileTypeImage = true;
      this.isFileTypeText = false;
      this.isFileTypeURL = false;
      this.dropdownSettingsVms=this.default_dropdownSettingsVms;
    }

  }

  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
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

  getSelectedVms(eve: any, type: any) {
    
    if (eve.length > 0) {
      if (type == 1) {
        eve.forEach((vms: any) => {
          //this.vmsIds = [];
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
      let inputVal = eve.value.split('|');
      let ipaddress = inputVal[0];
      let vmsid = inputVal[1];
      if (type == 1){
        this.vmsIds.push(eve.value),
          this.vmsId.push(vmsid);
         
       }
      else {
        var idx = 0;
        this.vmsIds.forEach(element => {
          if (element == eve.value) {
            this.vmsIds.splice(idx, 1);
          }
          idx++;
        });
      }
    }
    this.getMediaUploadData();

  }
  async ViewMedia(media: any) {
    const fileType = this.fileService.checkFileType(media.filePath);
    this.url = media.filePath;
    this.fileName = media.displayName;
    if (fileType == "image")
      this.format = "image";
    else
      this.format = "video";
    $('#myModal').modal('show');
    $('.modal-backdrop').remove();
    //const fileType = await fileTypeFromStream(media.filePath);
  }
  removeModal() {
    $('#myModal').modal('hide');

    // Remove the modal-backdrop class after the modal is closed
    $('.modal-backdrop').remove();
  }
  limitInput() {
    if (this.MediaName.length > 30) {
      this.MediaName = this.MediaName.substring(0, 25);
    }
  }
  clearForm() {
    this.form.reset();

    //this.selectedMedia = [];        
    //this.GetVmsDetails();    
    //this.isFileTypeImage = false;   
    //this.form.controls["isActive"].setValue(false);  
  }

  noLeadingEndingWhitespace(control: FormControl) {
    if (control.value && control.value.trimStart().length !== control.value.length) {
      return { leadingWhitespace: true };
    }
    else if (control.value && control.value.trimEnd().length !== control.value.length) {
      return { leadingWhitespace: true };
    }
    return null;
  }

  extractFileName(originalName: string): string {
    if (!originalName) {
      return '';
    }
    const lastDotIndex = originalName.lastIndexOf('.');
    const baseName = lastDotIndex === -1 ? originalName : originalName.substring(0, lastDotIndex);
    const extension = lastDotIndex === -1 ? '' : originalName.substring(lastDotIndex);
    const truncatedBaseName = baseName.substring(0, 25);
    return truncatedBaseName + extension;
  }
  SearchMediaName(){
    let searchVal = this.form.controls.MediaSearch.value;
    if(searchVal != ""){
      this.listOfMedialist = this.listOfSearchMedialist.filter((x:any)=>x.displayName.toLocaleLowerCase().includes(searchVal.toLocaleLowerCase()));
    } else {
      this.listOfMedialist = this.listOfSearchMedialist;
    }
  }

}
