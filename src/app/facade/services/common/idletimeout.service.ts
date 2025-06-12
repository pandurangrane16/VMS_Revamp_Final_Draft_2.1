import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class IdletimeoutService {
  private timeoutInMs: number; // 30 minutes
  private timeoutId: any;

  constructor(private router: Router, private ngZone: NgZone) {
    this.setupTimer();
    this.setupActivityListeners();

    this.timeoutInMs =  environment.autoTimeout * 60 * 1000;
  }

  private setupActivityListeners() {
    ['mousemove', 'keydown', 'click', 'scroll'].forEach(event => {
      document.addEventListener(event, () => this.resetTimer());
    });
  }

  private setupTimer() {
    this.ngZone.runOutsideAngular(() => {
      this.resetTimer();
    });
  }

  private resetTimer() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.ngZone.run(() => {
        this.logout();
      });
    }, this.timeoutInMs);
  }

  private logout() {
    // Clear session/local storage, etc.
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login
    this.router.navigate(['login']);
  }
}
