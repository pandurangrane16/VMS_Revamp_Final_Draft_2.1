import { Component, OnInit, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
declare var $: any; 
@Component({
  selector: 'app-media-uploadcvms',
  templateUrl: './media-uploadcvms.component.html',
  styleUrls: ['./media-uploadcvms.component.css']
})
export class MediaUploadcvmsComponent implements OnInit {

  form: any = [];
  _request: any = new InputRequest();
  active: boolean = false;
  loading: boolean = false;
  submitting: boolean = false;
  formValidations: any;
  formItems !: FormArray;
  medias: any[] = [];
  FileTypes: any[];
  mediatype: string;
  isFileTypeText: boolean = false;
  isFileTypeImage: boolean = false;
  RequestData: JSON;
  label1: string = "Select Controller";
  vmsIds: any[] = [];
  dropdownSettingsVms: any;
  _inputVmsData: any;
  pager: number = 0;
  recordPerPage: number = 0;
  startId: number = 0;
  searchText: string = "";
  filterVms: any;
  page: any;
  listOfMedialist: any;
  totalPages: number = 1;
  totalRecords!: number;
  closeResult!: string;
  isSearch: boolean = false;
  selectedMedia: any[] = [];
  selectedIds: number[] = [];
  url: string = "";
  format: string = "";
fileName : string="";
  get f() { return this.form.controls; }

  constructor(private adminFacade: AdminFacadeService,
    private _CVMSfacade: CVMSMediaFacadeServiceService,
    private _media: MediaFacadeService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    public _commonFacade: CommonFacadeService,
    public _router: Router,
    private fileService: FileServiceService
  ) {
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
    this.FileTypes = this.getFileType();

  }


  BuildForm() {
    this.form = this.formBuilder.group({
      //MediaTextName: ['', [Validators.required, Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$")]],
      MediaTextName: ['', ''],
      MediaFileName: ['', ''],
      mediaName: ['', ''],
      mediatype: ['', ''],
    });
  }
  BacktoList() {
    this._router.navigate(['cvms/uploadMedia']);
  }


  ngOnInit(): void {
    this.GetVmsDetails();
    this.getMedialistData();
  }


  onSubmit() {
    for (let i = 0; i < this.vmsIds.length; i++) {
      const element = this.vmsIds[i];
      if (this.isFileTypeImage) {
        for (let j = 0; j < this.selectedIds.length; j++) {
          const media = this.selectedMedia[j];
          //console.log(JSON.stringify(media));
          this.AddUpdateMedia(element, media);
        }
      } else {
        this.AddUpdateMedia(element, null);
      }
    }

  }

  AddUpdateMedia(element?: any, media?: any) {
    console.log(media);
    let _vcmsuploadmediadata = new Vcmsuploadmedia();
    _vcmsuploadmediadata.controllerName = element;
    _vcmsuploadmediadata.IpAddress = "172.19.32.51"
    if (media != null) {
      _vcmsuploadmediadata.medianame = media.displayName;
    }
    else {
      _vcmsuploadmediadata.medianame = this.form.controls.MediaTextName.value;
    }

    _vcmsuploadmediadata.status = 0;
    _vcmsuploadmediadata.AuditedBy = "Ashish S";
    _vcmsuploadmediadata.IsAudited = true;
    _vcmsuploadmediadata.AuditedTime = new Date();
    _vcmsuploadmediadata.Reason = "Upload Data for test";
    _vcmsuploadmediadata.createddate = new Date();

    if (this.isFileTypeText) {
      let _requestTextData = {
        type: this.form.controls.mediatype.value,
        id: 0,
        name: this.form.controls.mediaName.value,
        text: this.form.controls.MediaTextName.value
      }
      _vcmsuploadmediadata.RequestData = JSON.stringify(_requestTextData);
    }
    else {
      let _requestTextData = {
        type: this.form.controls.mediatype.value,
        id: 0,
        name: media.fileName,
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
      }
      this._router.navigate(['cvms/uploadMedia']);
    });

  }

  getFileType() {
    return ['media', 'text'];
  }
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
      }
      else
        this.toast.error("Failed to failed media details.", "Error", { positionClass: "toast-bottom-right" });
    }, (err) => { console.log(err) });
  }

  onUploadTypeChange(value: any) {

    if (this.mediatype == 'text') {

      this.isFileTypeText = true;
      this.isFileTypeImage = false;
    }
    else {
      this.isFileTypeImage = true;
      this.isFileTypeText = false;
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
        let commonList: CommonSelectList[] = [];
        data.data.forEach((ele: any) => {
          if (ele.vmdType == 2) {
            var _commonSelect = new CommonSelectList();
            _commonSelect.displayName = ele.description;
            _commonSelect.value = ele.ipAddress;
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
          this.vmsIds.push(vms.value);
        });
      }
      else {
        eve.forEach((ele: any) => {
          var idx = 0;
          this.vmsIds.forEach(element => {
            if (element == ele.value) {
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
      if (type == 1)
        this.vmsIds.push(eve.value);
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

  }


  clearForm() {

    this.form.reset();
    this.form.controls["isActive"].setValue(false);
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
  removeModal(){
    $('#myModal').modal('hide');

    // Remove the modal-backdrop class after the modal is closed
    $('.modal-backdrop').remove();
  }
}
