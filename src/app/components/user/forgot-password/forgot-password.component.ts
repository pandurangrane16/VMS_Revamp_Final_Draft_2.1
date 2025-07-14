import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subject, takeUntil } from 'rxjs';
import { ResetpasswordService } from 'src/app/facade/services/user/resetpassword.service';
import { getErrorMsg } from 'src/app/utils/utils';
import { ToastrService } from 'ngx-toastr';
import { UserFacadeService } from 'src/app/facade/facade_services/user-facade.service';
import { Reset } from 'src/app/models/request/Login';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  timeLeft: number = 60;
  resend : boolean = false;
  private destroy$ = new Subject<void>();
  form: any = [];
  active: boolean = false;
  loading: boolean = false;
  submitting: boolean = false;
  validate : boolean = false;
  otpView : boolean = false;
  _request: any = new Reset();
  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private userFacade: UserFacadeService,
  private toast: ToastrService,
  public _router: Router) {

  }
  startTimer() {
    this.timeLeft = 60;
    this.resend = true;
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this.timeLeft = 60;
          this.resend = false;
          this.stopTimer();
        }
      });
  }
  stopTimer() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  BuildForm() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern("^[A-Za-z][A-Za-z]*$")]],
      emailId: ['', [Validators.required]],
      otp: [null, [Validators.required]],
      newPassword: ['', [Validators.required]],
    });
  }

  get f() { return this.form.controls; }
  ngOnInit(): void {
    this.BuildForm();
  }

  BackToList() {
    this.router.navigate(['login']);
  }
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }

  clearForm() {
    this.form.reset();
  }
 

  Generateotp() {
    console.log(this.form);
  
    this.userFacade.SendOtp(this.form.controls.username.value, this.form.controls.emailId.value)
      .subscribe(
        (response: any) => {
          if (response?.success) {
            this.otpView = true;
            this.startTimer();
  
            this.toast.success(`OTP sent successfully to ${response.emailID}.`);
          } else {
            this.otpView = false;
            this.toast.error(response.msg || 'Failed to send OTP. Please try again.');
          }
        },
        (err: any) => {
          console.error(err);
          this.toast.error('An error occurred while sending OTP.');
        }
      );
  }

  Resend() {
    console.log(this.form);
    
    this.stopTimer();
    this.resend=false;

    this.form.patchValue({ otp: '' });
    this.userFacade.SendOtp(this.form.controls.username.value, this.form.controls.emailId.value)
      .subscribe(
        (response: any) => {
          if (response?.success) {
            this.otpView = true;
            this.startTimer();
            this.resend=true;
  
            this.toast.success(`OTP sent successfully to ${response.emailID}.`);
          } else {
            this.otpView = false;
            this.toast.error(response.msg || 'Failed to send OTP. Please try again.');
          }
        },
        (err: any) => {
          console.error(err);
          this.toast.error('An error occurred while sending OTP.');
        }
      );
  }

  ResetPass(){
    this._request.username = this.form.controls.username.value;
    this._request.emailId=this.form.controls.emailId.value;
    this._request.newPassword = this.form.controls.newPassword.value;
    this._request.otp=this.form.controls.otp.value;

    this.userFacade.ResetPassword(this._request).subscribe((response: any) => {
     
      if (response == 1 ) {
        
        
  
        this.toast.success(`Password Reset Done successfully`);
        this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this._router.navigate(['login']);});
        this.validate = true;
      } else {
        this.validate = false;
        this.form.patchValue({ otp: '' });
        this.toast.error('Failed to Validate. Please try again.');
      }   }, (err: any) => console.error(err));
  
  }
    
    



ValidateOTP(){
    this.validate = true;
    this.userFacade.ValidateOTP(this.form.controls.username.value, this.form.controls.otp.value).subscribe((response: any) => {
     if(response == 2) {
      this.toast.error("OTP validity is expired, kindly generate again.");
 this.validate=false;
     }
      else if (response == 1 ) {
        
        
  
        this.toast.success(`OTP validated successfully`);
        this.stopTimer();
        this.resend=false;
        this.validate = true;
      } else {
        
        this.validate = false;
        this.form.patchValue({ otp: '' });
        this.toast.error('Failed to Validate. Please try again.');
      }   }, (err: any) => console.error(err));
}
  // onSubmit() {
  //   this.otpView = true;
  //   console.log(this.form);
  //   this.startTimer();
  // }

}
