import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { getErrorMsg } from 'src/app/utils/utils';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  form: any = [];
  active: boolean = false;
  loading: boolean = false;
  submitting: boolean = false;
  constructor(private formBuilder: FormBuilder,) {

  }

   BuildForm() {
      this.form = this.formBuilder.group({
        username: ['', [Validators.required, Validators.pattern("^[A-Za-z][A-Za-z]*$")]],
        password: ['', [Validators.required, ]],
      });
    }

  get f() { return this.form.controls; }
  ngOnInit(): void {

  }

  BackToList() {

  }
    getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
      return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
    }

    clearForm(){

    }

    onSubmit(){
      console.log(this.form);
    }
    
}
