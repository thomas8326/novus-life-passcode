import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ContactUsLinksComponent } from 'src/app/components/contact-us-links/contact-us-links.component';
import { SlideShowComponent } from 'src/app/components/slide-show/slide-show.component';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    SlideShowComponent,
    RouterLink,
    ContactUsLinksComponent,
  ],
  standalone: true,
})
export class HomeComponent {
  page: 'home' | 'introduce' | 'product' | 'calculate' | 'aboutUs' = 'home';

  subArrayLength$ = this.responsive
    .getDeviceObservable()
    .pipe(map((device) => (device.mobile ? 1 : device.tablet ? 2 : 3)));

  constructor(public readonly responsive: ResponsiveService) {}

  updatePage(page: typeof this.page) {
    this.page = page;
  }
}
