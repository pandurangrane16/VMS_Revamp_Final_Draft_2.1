import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subject, takeUntil } from 'rxjs';
import { getErrorMsg } from 'src/app/utils/utils';

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
  constructor(private formBuilder: FormBuilder, private router: Router) {

  }
  startTimer() {
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

  }
ValidateOTP(){
    this.validate = true;
}
  onSubmit() {
    this.otpView = true;
    console.log(this.form);
    this.startTimer();
  }

}
