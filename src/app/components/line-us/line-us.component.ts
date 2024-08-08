import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { LINE_ID } from 'src/app/consts/app';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-line-us',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed right-4 bottom-4 z-50 flex flex-col items-end mx-2">
      <div
        [@slideInOut]="showQRCode ? 'in' : 'out'"
        class="bg-white p-4 rounded-lg shadow-lg mb-2 overflow-hidden  flex-col items-center justify-center sm:flex hidden"
      >
        <h2 class="text-lg font-bold mb-2">掃描 QR 碼加入好友</h2>
        <img
          src="assets/qr-code/line-qr-code.png"
          alt="QR Code"
          class="w-32 h-32"
        />
      </div>
      <button
        (click)="openQRCode()"
        [class]="
          twMerge(
            'bg-green-500 text-white px-4 py-2 rounded-full items-center space-x-2 hover:bg-green-600 transition duration-300 sm:flex hidden'
          )
        "
      >
        <span class="hidden sm:block">聯絡我們</span>
        <img
          src="assets/logo/LINE_Brand_icon.png"
          alt="LINE"
          class="w-8 h-8 text-white"
        />
      </button>
      <a
        [href]="link"
        target="_blank"
        [class]="
          twMerge(
            'p-1 rounded-full bg-green-500 sm:hidden flex overflow-hidden'
          )
        "
      >
        <img
          src="assets/logo/LINE_Brand_icon.png"
          alt="LINE"
          class="w-12 h-12 text-white"
        />
      </a>
    </div>
  `,
  styles: [],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          height: '*',
          opacity: 1,
        }),
      ),
      state(
        'out',
        style({
          height: '0px',
          opacity: 0,
        }),
      ),
      transition('in => out', [animate('300ms ease-in-out')]),
      transition('out => in', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class LineUsComponent {
  showQRCode = false;
  isMobile = false;
  twMerge = twMerge;
  link = `https://line.me/R/ti/p/${LINE_ID}`;

  openQRCode() {
    this.showQRCode = !this.showQRCode;
  }

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.showQRCode) {
      const clickedInside = this.elementRef.nativeElement.contains(
        event.target,
      );
      if (!clickedInside) {
        this.showQRCode = false;
      }
    }
  }
}
