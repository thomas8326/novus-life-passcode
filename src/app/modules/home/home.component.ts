import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
  LUCKY_FILES = signal<SlideShowItem[]>([]);
  CAREER_FILES = signal<SlideShowItem[]>([]);
  HAPPINESS_FILES = signal<SlideShowItem[]>([]);

  subArrayLength = toSignal(
    this.responsive
      .getDeviceObservable()
      .pipe(map((device) => (device.mobile ? 1 : device.tablet ? 3 : 4))),
    { initialValue: 3 },
  );

  constructor(public readonly responsive: ResponsiveService) {}

  ngOnInit(): void {
    this.LUCKY_FILES.set(
      new Array(22).fill('').map((_, index) => ({
        id: index.toString(),
        content: `/assets/images/slideshow/lucky${index + 1}.jpg`,
      })),
    );
    this.CAREER_FILES.set(
      new Array(17).fill('').map((_, index) => ({
        id: index.toString(),
        content: `/assets/images/slideshow/career${index + 1}.jpg`,
      })),
    );
    this.HAPPINESS_FILES.set(
      new Array(12).fill('').map((_, index) => ({
        id: index.toString(),
        content: `/assets/images/slideshow/happiness${index + 1}.jpg`,
      })),
    );
  }
}
