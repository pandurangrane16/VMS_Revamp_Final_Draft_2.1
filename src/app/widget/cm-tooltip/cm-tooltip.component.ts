import { Component } from '@angular/core';
import { TooltipPosition, TooltipTheme } from 'src/app/utils/tooltip.enums';

@Component({
  selector: 'app-cm-tooltip',
  templateUrl: './cm-tooltip.component.html',
  styleUrls: ['./cm-tooltip.component.css']
})
export class CmTooltipComponent {

  position: TooltipPosition = TooltipPosition.DEFAULT;
  theme: TooltipTheme = TooltipTheme.DEFAULT;
  tooltip = '';
  left = 0;
  top = 0;
  visible = true;

  constructor() {
  }

  ngOnInit(): void {
  }
}
