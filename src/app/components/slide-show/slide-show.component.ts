import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  QueryList,
  Renderer2,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { interval } from 'rxjs';
import { SlideShowItem } from 'src/app/models/slide-show';
import { v4 } from 'uuid';

@Component({
  selector: 'app-slide-show',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <ul
      class="relative grid grid-rows-[100%] w-auto overflow-hidden"
      #slideGallery
    >
      @for (rooms of gallery(); track i; let i = $index) {
        @if (slideIndex() === i) {
          <li
            @imageSlide
            class="absolute gap-12 w-full h-full flex"
            #slideExhibitionRoom
          >
            @for (item of rooms; track i; let i = $index) {
              @if (!item.content) {
                <div class="flex-1"></div>
              } @else {
                @switch (type()) {
                  @case ('CHAT_CARD') {
                    <div class="flex-1">
                      <div
                        class="border rounded-[8px] flex flex-col bg-white h-full"
                      >
                        <div class="flex-1 overflow-auto">
                          <img class="w-full h-full" [src]="item.content" />
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
                        <div
                          class="w-full h-full rounded-[10px] overflow-hidden"
                        >
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
export class SlideShowComponent {
  private renderer = inject(Renderer2);

  time = input(8000); // ms
  columnCount = input(1);
  rowCount = input(1);
  type = input<'CHAT_CARD' | 'IMAGE_CARD'>('CHAT_CARD');
  subArrayLength = input(3);
  slideItems = input<SlideShowItem[]>([]);

  @ViewChild('slideGallery', { static: true }) slideGallery!: ElementRef<any>;
  @ViewChildren('slideExhibitionRoom') exhibitionRooms!: QueryList<ElementRef>;

  slideIndex = signal(0);
  windowBlur = signal(false);

  gallery = computed(() =>
    this.listToMatrix(this.slideItems(), this.subArrayLength()),
  );

  constructor() {
    effect(() => {
      this.setShowGalleryColumn();
    });

    effect(() => {
      this.setExhibitionRoomsColumnAndRow();
    });

    interval(this.time())
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (!this.windowBlur()) {
          this.slideNext();
        }
      });
  }

  setShowGalleryColumn() {
    const column = `repeat(${this.gallery().length}, 100%)`;
    const gallery = this.slideGallery.nativeElement;

    this.renderer.setStyle(gallery, 'grid-template-columns', `${column}`);
    this.renderer.setStyle(gallery, 'height', `${600}px`);
  }

  setExhibitionRoomsColumnAndRow() {
    const room = this.exhibitionRooms?.toArray();
    if (room && room[0]) {
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
  }

  gridColumns() {
    const columnPercent = 100 / this.columnCount();
    return `repeat(${this.columnCount()}, ${columnPercent}%)`;
  }

  gridRows() {
    const rowPercent = 100 / this.rowCount();
    return `repeat(${this.rowCount()}, ${rowPercent}%)`;
  }

  slideNext() {
    this.slideIndex.update((index) => {
      if (index >= this.gallery().length - 1) {
        return 0;
      }
      return index + 1;
    });
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

    let lastRowLength = matrix[matrix.length - 1].length;

    while (lastRowLength < elementsPerSubArray) {
      matrix[matrix.length - 1].push({ id: v4(), content: '' });
      lastRowLength++;
    }

    return matrix;
  }
}
