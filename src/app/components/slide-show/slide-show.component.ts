import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription, timer } from 'rxjs';
import { SlideShowItem } from 'src/app/models/slide-show';

@Component({
  selector: 'app-slide-show',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="flex items-center justify-center w-full relative">
      <div class="flex items-center w-[80%] overflow-hidden relative group">
        <div class="absolute w-full h-full z-10"></div>
        <ul
          class="flex transition-transform ease-out duration-500 w-[350px]  flex-none"
          [style.transform]="'translateX(' + -slideIndex() * 100 + '%)'"
          #slideGallery
        >
          @for (item of gallery; track item.id; let idx = $index) {
            <li
              class="w-full rounded-lg aspect-[9/12] flex-none relative overflow-hidden"
              [class.scale-90]="idx !== slideIndex()"
              @imageSlide
              #slideExhibitionRoom
            >
              <img class="w-full h-full" [src]="item.content" />
            </li>
          }
        </ul>
      </div>
      <div
        class="flex absolute -bottom-5 -translate-x-48 bg-blue-300 rounded-[60px] justify-center z-10"
      >
        <button mat-button (click)="slidePrev()" class="cursor-pointer">
          <mat-icon fontIcon="chevron_left" class=" text-gray-700"></mat-icon>
        </button>

        <button mat-button (click)="stopTimer()" class="cursor-pointer">
          <mat-icon fontIcon="pause" class="text-gray-700"></mat-icon>
        </button>

        <button mat-button (click)="slideNext()" class="cursor-pointer">
          <mat-icon fontIcon="chevron_right" class=" text-gray-700"></mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: ``,
  animations: [
    trigger('imageSlide', [
      transition(':enter', [
        style({
          transform: 'translateX(100%)',
        }),
        animate(
          '1s ease',
          style({
            transform: 'translateX(0%)',
          }),
        ),
      ]),
      transition(':leave', [
        style({
          transform: 'translateX(0%)',
        }),
        animate(
          '1s ease',
          style({
            transform: 'translateX(-100%)',
          }),
        ),
      ]),
    ]),
  ],
})
export class SlideShowComponent implements AfterViewInit {
  @Input() gallery: SlideShowItem[] = [];

  slideIndex = signal(0);
  private carouselTimerSubscription: Subscription | null = null;

  slideNext(resetTimer = true) {
    this.slideIndex.update((prev) =>
      prev === this.gallery.length - 1 ? 0 : prev + 1,
    );
    if (resetTimer) {
      this.startTimer();
    }
  }

  slidePrev() {
    this.slideIndex.update((prev) =>
      prev === 0 ? this.gallery.length - 1 : prev - 1,
    );
    this.startTimer();
  }

  ngAfterViewInit(): void {
    this.startTimer();
  }

  stopTimer() {
    this.carouselTimerSubscription?.unsubscribe();
  }

  startTimer() {
    this.carouselTimerSubscription?.unsubscribe();
    this.carouselTimerSubscription = timer(10000, 10000).subscribe(() => {
      this.slideNext(false);
    });
  }
}
