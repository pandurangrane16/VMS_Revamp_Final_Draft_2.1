import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';
import { LoaderService } from 'src/app/facade/services/common/loader.service';
const incr = 1;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements AfterViewInit, OnInit {
  changeToShow = false;
  progress = 50;
  constructor(public loader: LoaderService,
              private _cdr : ChangeDetectorRef,
              private _mediaFacade: MediaFacadeService
             ) {
    console.log(this.loader.isLoading$);
    setInterval(()=> {
      if(this.progress < 100){
        this.progress = this.progress + incr;
        
      }
      else{
        this.progress = 50;
      }
    }, 100);
  
   
  }
  
 
  ngAfterViewInit(){
    this._cdr.detectChanges();
  }
  ngOnInit() {
    this._mediaFacade.getProcess().subscribe(x => {
      this.changeToShow = x;
    }); 
   
   }

}
