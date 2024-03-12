import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { timer } from 'rxjs';
import { SlideShowItem } from 'src/app/models/slide-show';

@Component({
  selector: 'app-slide-show',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <ul
      class="relative grid grid-rows-[100%] w-auto overflow-hidden"
      #slideGallery
    >
      @for (rooms of gallery; track i; let i = $index) {
        @if (slideIndex === i) {
          <li
            @imageSlide
            class="absolute gap-12 w-full h-full flex"
            #slideExhibitionRoom
          >
            @for (item of rooms; track i; let i = $index) {
              @switch (type) {
                @case ('CHAT_CARD') {
                  <div class="flex-1">
                    <div
                      class="border rounded-[8px] flex flex-col bg-white h-full"
                    >
                      <div class="flex-1 py-2 overflow-auto">
                        <img class="w-full" [src]="item.content" />
                      </div>
                      <div
                        class="border-t h-[48px] px-2 flex items-center flex-none"
                      >
                        Novus晶礦人生 x 紋君堡石坊
                      </div>
                    </div>
                  </div>
                }
                @case ('IMAGE_CARD') {
                  <div class="flex-1">
                    <div
                      class="border rounded-[14px] flex flex-col  h-full bg-gradient-to-l from-highLight to-primary p-2"
                    >
                      <div class="w-full h-full rounded-[10px] overflow-hidden">
                        <img
                          class="w-full h-full object-cover"
                          [src]="item.content"
                        />
                      </div>
                    </div>
                  </div>
                }
              }
            }
          </li>
        }
      }
    </ul>
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
  @Input() time = 8000; // s
  @Input() subArrayLength = 3;
  @Input() columnCount = 1;
  @Input() rowCount = 1;
  @Input() type: 'CHAT_CARD' | 'IMAGE_CARD' = 'CHAT_CARD';

  @Input('gallery') set showGallery(list: SlideShowItem[]) {
    this.gallery = this.listToMatrix(list, this.subArrayLength);
  }

  @ViewChild('slideGallery', { static: true }) slideGallery!: ElementRef<any>;
  @ViewChildren('slideExhibitionRoom') exhibitionRooms!: QueryList<ElementRef>;

  gallery: SlideShowItem[][] = [];
  slideIndex = 0;

  windowBlur = false;

  constructor(private readonly renderer: Renderer2) {}

  @HostListener('window:blur')
  blur() {
    this.windowBlur = true;
  }

  @HostListener('window:focus')
  focus() {
    this.windowBlur = false;
  }

  ngAfterViewInit() {
    this.setShowGalleryColumn();
    this.setSlideTime();
  }

  setSlideTime() {
    timer(0, this.time).subscribe(() => {
      if (!this.windowBlur) {
        this.onNext();
      }
    });
  }

  onNext() {
    this.slideNext();
  }

  setShowGalleryColumn() {
    const column = `repeat(${this.gallery.length}, 100%)`;
    const gallery = this.slideGallery.nativeElement;

    this.renderer.setStyle(gallery, 'grid-template-columns', `${column}`);
    this.renderer.setStyle(gallery, 'height', `${600}px`);
  }

  setExhibitionRoomsColumnAndRow() {
    const room = this.exhibitionRooms.toArray();
    this.renderer.setStyle(
      room[0].nativeElement,
      'grid-template-rows',
      this.gridRows(),
    );
    this.renderer.setStyle(
      room[0].nativeElement,
      'grid-template-columns',
      this.gridColumns(),
    );
  }

  gridColumns() {
    const columnPercent = 100 / this.columnCount;

    return `repeat(${this.columnCount}, ${columnPercent}%)`;
  }

  gridRows() {
    const rowPercent = 100 / this.rowCount;

    return `repeat(${this.columnCount}, ${rowPercent}%)`;
  }

  slideNext() {
    this.slideIndex++;

    if (this.slideIndex > this.gallery.length - 1) {
      this.slideIndex = 0;
    }
  }

  listToMatrix(list: SlideShowItem[], elementsPerSubArray: number) {
    const matrix: SlideShowItem[][] = [];

    for (let i = 0, k = -1; i < list.length; i++) {
      if (i % elementsPerSubArray === 0) {
        k++;
        matrix[k] = [];
      }

      matrix[k].push(list[i]);
    }

    console.log(matrix);

    return matrix;
  }
}
