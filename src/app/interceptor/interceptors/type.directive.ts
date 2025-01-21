import { Directive, HostListener, Injectable } from '@angular/core';

@Directive({
  selector: '[appBlockCopyPaste]'
})
export class TypeDirective {
  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    event.preventDefault();
  }
}
