import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ContactUsLinksComponent } from 'src/app/components/contact-us-links/contact-us-links.component';
import { SlideShowComponent } from 'src/app/components/slide-show/slide-show.component';
import { SlideShowItem } from 'src/app/models/slide-show';
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
export class HomeComponent implements OnInit {
  page: 'home' | 'introduce' | 'product' | 'calculate' | 'aboutUs' = 'home';

  LUCKY_FILES: SlideShowItem[] = [];
  CAREER_FILES: SlideShowItem[] = [];
  HAPPINESS_FILES: SlideShowItem[] = [];

  subArrayLength$ = this.responsive
    .getDeviceObservable()
    .pipe(map((device) => (device.mobile ? 1 : device.tablet ? 3 : 4)));

  constructor(public readonly responsive: ResponsiveService) {}

  updatePage(page: typeof this.page) {
    this.page = page;
  }

  ngOnInit(): void {
    this.LUCKY_FILES = new Array(22).fill('').map((_, index) => ({
      id: index.toString(),
      content: `/assets/images/slideshow/lucky${index + 1}.jpg`,
    }));
    this.CAREER_FILES = new Array(17).fill('').map((_, index) => ({
      id: index.toString(),
      content: `/assets/images/slideshow/career${index + 1}.jpg`,
    }));
    this.HAPPINESS_FILES = new Array(12).fill('').map((_, index) => ({
      id: index.toString(),
      content: `/assets/images/slideshow/happiness${index + 1}.jpg`,
    }));
  }
}
