import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from 'src/app/utils/global';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';
import { PlaylistMedia, SelectedMediaVCMS } from 'src/app/models/vcms/selectedMedia';
import { CVMSMediaModalComponent } from '../cvmsmedia-modal/cvmsmedia-modal.component';
import { getErrorMsg } from 'src/app/utils/utils';
import { ToastrService } from 'ngx-toastr';
import { FileServiceService } from 'src/app/facade/services/vcms/file-service.service';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Mediascheduler } from 'src/app/models/vcms/mediascheduler';
import { catchError } from 'rxjs';
@Component({
  selector: 'app-mediascheduler-edit',
  templateUrl: './mediascheduler-edit.component.html',
  styleUrls: ['./mediascheduler-edit.component.css']
})

export class MediaSchedulerEditComponent {

}
