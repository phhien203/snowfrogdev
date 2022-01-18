import { Component } from '@angular/core';
import { UnleashService } from '@snowfrog/ngx-unleash-proxy-client';

@Component({
  selector: 'snowfrog-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private unleash: UnleashService) {}
  get title(): string {
    if(this.unleash.isEnabled('testing-toggles')) {
      const variant = this.unleash.getVariant('testing-toggles');
      return `The toggle is on and the variant is ${variant.name}`;
    }
    return 'The toggle is off';
  }
}
