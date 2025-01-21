import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { Globals } from 'src/app/utils/global';

@Component({
  selector: 'app-media-clearance',
  templateUrl: './media-clearance.component.html',
  styleUrls: ['./media-clearance.component.css']
})
export class MediaClearanceComponent implements OnInit {
  searchText!: string;
  gridArr: any[] = [];
  headArr: any[] = [];
  constructor(private toast: ToastrService,
    private adminFacade: AdminFacadeService,
    private global: Globals,
    private router: Router) {
    this.global.CurrentPage = "Media Clearance";
  }
  ngOnInit(): void {
    this.adminFacade.getMediaClearance().subscribe(res => {
      if (res != null) {
        this.gridArr = res;
      }
    });
  }
  Search() {

  }
  ShowForm(item: any) {

  }
  getVmsData() {

  }
  onMediaClear(vms: number) {
    if (vms != 0) {
      let arr = [vms];
      this.adminFacade.mediaClearance(arr).subscribe(res => {
        if (res == 1) {
          this.toast.success("Media cleared");
        } else
          this.toast.error("Something went wrong", "Error", { positionClass: 'toast-bottom-right' });
      })
    }
    else {

    }
  }
  RemoveMedias(type: number) {
    let arr = [];
    if (type == 0) {
      this.gridArr.forEach(ele => {
        arr.push(ele.vmsId);
      });
    }
    else {
      arr.push(type);
    }

    this.adminFacade.mediaClearance(arr).subscribe(res => {
      if (res == 1) {
        this.toast.success("Media removed successfully");
      } else {
        this.toast.error("Something went wrong");
      }
    })
  }
  BackToList() {
    this.router.navigate(['dashboard']);
  }
}
