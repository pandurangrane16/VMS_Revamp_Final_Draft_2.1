import { Component, numberAttribute } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from 'src/app/utils/global';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';
import { Mediaplayer } from 'src/app/models/vcms/mediaplayer';
import { getErrorMsg } from 'src/app/utils/utils';
@Component({
    selector: 'app-mediaplayer-edit',
    templateUrl: './mediaplayer-edit.component.html',
    styleUrls: ['./mediaplayer-edit.component.css']
  })

  export class MediaPlayerEditComponent {

    editForm!: FormGroup;
    mediaId!: number;
    SelectedControllerId: any;
    _inputVmsData: any;
    MediaName: string;

      constructor(
        private fb: FormBuilder,
       // private toast: ToastrService,
         private global: Globals,
        // private _media: MediaFacadeService,
        // private adminFacade: AdminFacadeService,
        private _router: Router,
        private _ActivatedRoute:ActivatedRoute,
        private _CVMSfacade: CVMSMediaFacadeServiceService,
        // private fileService: FileServiceService,
        private modalService: NgbModal,) 
        {
        this.global.CurrentPage = "Create Media Player CVMS";
      }

      get f() { return this.editForm.controls; }

      ngOnInit(): void {
        this.editForm = this.fb.group({
          name: ['', ''],
          mediaLoopCount: ['', [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
          tiles: this.fb.array([])
        });
    
       // this.UpdateValidations();
        // this.registrationForm.get('name')?.valueChanges.subscribe((Method:any)=>{
        //   this.UpdateValidations(Method);
        // })
       // this.GetVmsDetails();
      }



      

    //   ngOnInit(): void {
    //     this.mediaId = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));
    //     this.initializeForm();
    //      this.loadMediaData();
    //   }
      getSelectedVms(eve: any) {
        const selectElement = eve.target as HTMLSelectElement;
        const colindex = selectElement.value.indexOf(":");
        if (colindex !== -1) {
          this.SelectedControllerId =  selectElement.value.slice(colindex + 1, selectElement.value.length).replace(/\s+/g, '').split("|");     
          
        }
      }
      initializeForm() {
        this.editForm = this.fb.group({
          name: [{ value: '', disabled: true }],
          mediaLoopCount: [{ value: '', disabled: true }],
          tiles: this.fb.array([
            this.fb.group({
              tileNo: ['', Validators.required],
              playlistLoopCount: ['', Validators.required],
              playlist: this.fb.array([]) // Nested FormArray
            })
          ])
        });
      }
      getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
        return getErrorMsg(this.editForm, _controlName, _controlLable, _isPattern, _msg);
      }

      loadMediaData() {
         let _mediaplayer = new Mediaplayer();
        this._CVMSfacade.GetMediaPlayer(0,1).subscribe(data => {
          this.editForm.patchValue({
            name: data.name,
            mediaLoopCount: data.mediaLoopCount
          });
        

          
    
          const tilesArray = this.editForm.get('tiles') as FormArray;
          data.tiles.forEach((tile: any) => {
            tilesArray.push(this.fb.group({
              tileNo: [{ value: tile.tileNo, disabled: true }],
              playlistLoopCount: [{ value: tile.playlistLoopCount, disabled: true }],
              playlist: this.fb.array(tile.playlist.map((p: any) =>
                this.fb.group({
                  mediaName: [{ value: p.mediaName, disabled: true }],
                  playOrder: [{ value: p.playOrder, disabled: true }],
                  imageTextDuration: [{ value: p.imageTextDuration, disabled: true }],
                  videoLoopCount: [{ value: p.videoLoopCount, disabled: true }],
                  textStyle: this.fb.group({
                    fontSize: [{ value: p.textStyle.fontSize, disabled: true }],
                    fontColor: [{ value: p.textStyle.fontColor, disabled: true }],
                    backgroundColor: [{ value: p.textStyle.backgroundColor, disabled: true }]
                  })
                })
              ))
            }));
          });
        });
      }
    
      get tiles(): FormArray {
        return this.editForm.get('tiles') as FormArray;
      }
    
      getPlaylist(index: number): FormArray {
        return this.tiles.at(index).get('playlist') as FormArray;
      }
    
      BacktoList() {
        window.history.back();
      }
      onSubmit(): void {
        if (this.editForm.valid) {
          console.log(this.editForm.value);
        }
      }
    }
