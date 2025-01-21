import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mediascheduler',
  templateUrl: './mediascheduler.component.html',
  styleUrls: ['./mediascheduler.component.css']
})
export class MediaschedulerComponent {
  form: any = [];
  mediauploadtype:string;
  isFileTypeText: boolean = false;
  isFileTypeImage: boolean = false;
  FileTypes: any[];
  MediaName:string;

  constructor(private formBuilder: FormBuilder){
    this.FileTypes = ['Image File', 'Media Text']
    this.BuildForm();
  }
BuildForm() {
    this.form = this.formBuilder.group({    
         
      mediaName: ['', [Validators.required, Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$")]],
      mediatype: ['', ''],

    });
  }

  onUploadTypeChange(value: any) {
    console.log(this.mediauploadtype);
    console.log(this.MediaName);

    if(this.mediauploadtype == 'Media Text')
    {      
      this.isFileTypeText = true;
      this.isFileTypeImage = false;
    }
    else
    {
      this.isFileTypeImage = true;
      this.isFileTypeText = false;
    }
   
    
    
  }

}
