// image-loader.component.ts
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgClass } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { catchError, of, switchMap } from 'rxjs';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';

@Component({
  selector: 'app-image-loader',
  template: `
    <div class="relative h-full w-full" [ngClass]="class()">
      @if (loading()) {
        <div class="w-full h-full flex items-center justify-center">
          <div
            class="absolute inset-0"
            [@shimmerAnimation]="{ value: shimmerState() }"
          ></div>
          <div
            class="flex items-center justify-center relative w-[30%] aspect-square"
          >
            <div class="relative w-2/5 h-2/5 flex justify-center items-center">
              @for (
                item of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                track item;
                let i = $index
              ) {
                <div
                  [@spinnerAnimation]="{
                    value: loadingState(),
                    params: {
                      rotation: i * 36 + 'deg',
                      translationNormal: '150%',
                      translationExtended: '225%',
                      delay: i * 0.1 + 's',
                    },
                  }"
                  class="absolute w-[25%] h-[150%]"
                  [style.background-color]="COLORS[i]"
                ></div>
              }
            </div>
            <img
              src="assets/logo/novus-logo.png"
              class="w-3/5 aspect-square absolute"
              alt="crystalImg"
            />
          </div>
        </div>
      }
      <img
        [src]="firebaseImgUrl()"
        alt="crystalImg"
        class="object-cover h-full w-full"
        [class.hidden]="loading()"
        (load)="onLoad()"
      />
      @if (error()) {
        <div
          class="absolute inset-0 bg-gray-200 flex items-center justify-center w"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            class="w-1/3 h-1/3"
          >
            <g transform="translate(10,10)">
              <rect
                x="0"
                y="0"
                width="80"
                height="80"
                fill="white"
                stroke="#e0e0e0"
                stroke-width="2"
                rx="5"
                ry="5"
              />

              <polyline
                points="10,70 26,50 40,60 60,40 70,50 70,70 10,70"
                fill="#e0e0e0"
              />

              <circle cx="60" cy="20" r="8" fill="#e0e0e0" />

              <circle cx="40" cy="35" r="12" fill="#ff6b6b" />
              <rect x="38.5" y="28" width="3" height="10" fill="white" />
              <circle cx="40" cy="41" r="1.5" fill="white" />
            </g>
          </svg>
        </div>
      }
    </div>
  `,
  styles: [],
  animations: [
    trigger('shimmerAnimation', [
      state(
        '*',
        style({
          background: 'linear-gradient(90deg, #fff 25%, #f5f5f5 50%, #fff 75%)',
          backgroundSize: '200% 100%',
        }),
      ),
      transition(
        '* => *',
        animate(
          '1.5s 0.3s ease-in',
          keyframes([
            style({
              backgroundPosition: '200% 0',
            }),
            style({
              backgroundPosition: '-200% 0',
            }),
          ]),
        ),
      ),
    ]),
    trigger('spinnerAnimation', [
      state(
        '*',
        style({
          transform: 'rotate({{rotation}}) translate(0, {{translationNormal}})',
        }),
        {
          params: {
            rotation: '0deg',
            translationNormal: '150%',
          },
        },
      ),
      transition(
        '* => *',
        [
          animate(
            '1s {{delay}} ease',
            keyframes([
              style({
                transform:
                  'rotate({{rotation}}) translate(0, {{translationNormal}})',
                offset: 0,
              }),
              style({
                transform:
                  'rotate({{rotation}}) translate(0, {{translationExtended}})',
                offset: 0.5,
              }),
              style({
                transform:
                  'rotate({{rotation}}) translate(0, {{translationNormal}})',
                offset: 1,
              }),
            ]),
          ),
        ],
        {
          params: {
            rotation: '0deg',
            translationNormal: '150%',
            translationExtended: '225%',
            delay: '0s',
          },
        },
      ),
    ]),
  ],
  standalone: true,
  imports: [NgClass, FirebaseImgUrlDirective],
})
export class ImageLoaderComponent implements OnInit {
  COLORS = [
    '#E0D4C5',
    '#D5E1D6',
    '#E5D1D0',
    '#D6E1E0',
    '#E6DFD4',
    '#D3DCDD',
    '#E2D9D9',
    '#D8D7D4',
    '#C9D5CB',
    '#BFCCC7',
  ];

  fireStorage = inject(AngularFireStorage);

  src = input('');
  class = input('');
  firebaseImgUrl = toSignal(
    toObservable(this.src).pipe(
      switchMap((url) => {
        if (!url) {
          throw new Error('No image URL provided');
        }

        if (
          url.startsWith('gs://') ||
          url.startsWith('https://firebasestorage.googleapis.com/')
        ) {
          return this.fireStorage.refFromURL(url).getDownloadURL();
        } else {
          return of(url);
        }
      }),
      catchError((e) => {
        this.onError(e);
        return of(null);
      }),
    ),
  );

  loading = signal(true);
  error = signal(false);
  loadingState = signal(0);
  shimmerState = signal(0);
  private shimmerAnimationId: NodeJS.Timeout | null = null;
  private loadingAnimationId: NodeJS.Timeout | null = null;

  ngOnInit() {
    this.startAnimation();
  }

  onLoad() {
    this.stopAnimation();
    this.loading.set(false);
  }

  onError(e: any) {
    this.stopAnimation();
    this.loading.set(false);
    this.error.set(true);
  }

  private startAnimation() {
    this.loadingAnimationId = setInterval(() => {
      this.loadingState.update((prev) => (prev + 1) % 2);
    }, 1200);
    this.shimmerAnimationId = setInterval(() => {
      this.shimmerState.update((prev) => (prev + 1) % 2);
    }, 2000);
  }

  private stopAnimation() {
    this.loadingAnimationId && clearInterval(this.loadingAnimationId);
    this.shimmerAnimationId && clearInterval(this.shimmerAnimationId);
  }
}
