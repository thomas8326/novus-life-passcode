import { CommonModule } from '@angular/common';
import { Component, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotifyService } from 'src/app/services/notify/notify.service';

@Component({
  selector: 'app-hamburger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <label class="burger group" for="burger">
      <input
        type="checkbox"
        id="burger"
        [checked]="open()"
        (change)="open.set(burger.checked)"
        #burger
      />
      <span class="bg-highLight group-hover:bg-highLightHover"></span>
      <span class="bg-highLight group-hover:bg-highLightHover"></span>
      <span class="bg-highLight group-hover:bg-highLightHover"></span>
      @if (hasNotify()) {
        <div
          class="w-3 h-3 bg-red-500 text-white rounded-full flex items-center justify-center absolute -top-1 -right-1 shadow"
        ></div>
      }
    </label>
  `,
  styles: `
    .burger {
      position: relative;
      width: 30px;
      height: 20px;
      background: transparent;
      cursor: pointer;
      display: block;
    }

    .burger input {
      display: none;
    }

    .burger span {
      display: block;
      position: absolute;
      height: 4px;
      width: 100%;
      border-radius: 9px;
      opacity: 1;
      left: 0;
      transform: rotate(0deg);
      transition: 0.25s ease-in-out;
    }

    .burger span:nth-of-type(1) {
      top: 0px;
      transform-origin: left center;
    }

    .burger span:nth-of-type(2) {
      top: 50%;
      transform: translateY(-50%);
      transform-origin: left center;
    }

    .burger span:nth-of-type(3) {
      top: 100%;
      transform-origin: left center;
      transform: translateY(-100%);
    }

    .burger input:checked ~ span:nth-of-type(1) {
      transform: rotate(45deg);
      top: 0px;
      left: 5px;
    }

    .burger input:checked ~ span:nth-of-type(2) {
      width: 0%;
      opacity: 0;
    }

    .burger input:checked ~ span:nth-of-type(3) {
      transform: rotate(-45deg);
      top: 22px;
      left: 5px;
    }
  `,
})
export class HamburgerComponent {
  open = model(false);

  hasNotify = signal(false);

  constructor(private readonly notifyService: NotifyService) {
    this.notifyService.notify$.subscribe((notify) => {
      this.hasNotify.set(
        !notify.cartNotify.system.read || !notify.requestNotify.system.read,
      );
    });
  }
}
