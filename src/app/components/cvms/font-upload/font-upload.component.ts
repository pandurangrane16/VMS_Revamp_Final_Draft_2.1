import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';

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
    files: File[] = [];
   
    selectedFile: File | null = null;
   constructor(
     // private fb: FormBuilder,
      private _toast: ToastrService,
  
      private _router: Router,
      private formBuilder: FormBuilder,
      private toast: ToastrService,
     
      private _CVMSfacade: CVMSMediaFacadeServiceService,
      ) 
      
      {
         
          this.BuildForm();
        
      }
  



   
    BuildForm() {
      this.form = this.formBuilder.group({
        fontName: ['', [Validators.required, Validators.maxLength(50)]],
        fontFile: [null, [Validators.required]],
        isActive: [true]
      });
    }
    ngOnInit(): void {}
  
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

    onFileSelected(event: any): void {
      if (event.target.files.length > 0) {
        this.selectedFile = event.target.files[0];
        this.form.patchValue({ fontFile: this.selectedFile });
      }
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
    
      // Store the valid file
      this.files.push(file);
    
      this.toast.success("File selected successfully.");
    }
    
    onSubmit(): void {
      if (this.form.invalid || !this.selectedFile) {
        this._toast.error("Error occurred while saving data. Please select Input Values.");
        return;
      }
    
      const formData = new FormData();
      formData.append('fontName', this.form.value.fontName);
      formData.append('fontFile', this.selectedFile);
      formData.append('isActive', this.form.value.isActive ? 'true' : 'false');

    
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
          this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this._router.navigate(['cvms/MediaPlayerSchedulerList']);
          });
        }
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
  

