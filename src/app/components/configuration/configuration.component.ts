import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { UserFacadeService } from 'src/app/facade/facade_services/user-facade.service';

declare let $: any;
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
  id?: string;
  form!: FormGroup;
  title!: string;
  loading = false;
  user: any;

  //dtOptions: DataTables.Settings = {};
  dtOptions: any = {};
  allVmsList: any = [];
  clickStatus: string = " ";
  nativeElement: any;
  drawCallback: any;

  users?: any[];

  constructor(
    // private accountService: AccountService, 
    // private httpClient: HttpClient, 
    // public modalService: NgbModal,
    // private formBuilder: FormBuilder,
    private route: Router
  ) { }

  ngOnInit() {
    console.log("Form Refreshed");
  }
  openModal2(id: number) {

  }
  UserScreen() {
    this.route.navigate(['user']);
  }
  deleteUser(id: string) {

  }

  // edit(i:any, user:any){

  //   this.isedit=true;
  //   this.userform.id= user.id;
  //   this.userform.setValue({
  //     name:user.name,
  //     email:user.email,
  //     phone:user.phone,
  //     website:user.website
  //   })
  // }

  openModal() {

  }

  ngOnDestroy() {


  }


}
