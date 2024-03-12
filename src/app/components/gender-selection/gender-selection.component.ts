import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Gender } from 'src/app/consts/gender';

@Component({
  selector: 'app-gender-selection',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: ` <div class="flex w-full justify-center">
    <div
      class="flex relative border border-gray-200 rounded overflow-hidden w-[200px] h-[80px]"
    >
      <label
        class="w-full h-full flex items-center justify-center cursor-pointer"
        [ngClass]="{ 'bg-blue-300': gender === 'male' }"
        (click)="onSelectGender(Gender.Male)"
      >
        <mat-icon
          fontIcon="male"
          class="text-[30px] !w-[30px] !h-[30px]"
          [ngClass]="{ 'text-white': gender === 'male' }"
        ></mat-icon>
        <input class="hidden" type="radio" name="gender" value="male" />
      </label>
      <div
        class="absolute px-1.5 w-fit h-fit inset-1/2 transform -translate-x-1/2 -translate-y-1/2 border rounded bg-[#f6f6f6]"
      >
        OR
      </div>
      <label
        class="w-full h-full flex items-center justify-center cursor-pointer"
        [ngClass]="{ 'bg-red-300': gender === 'female' }"
        (click)="onSelectGender(Gender.Female)"
      >
        <mat-icon
          fontIcon="female"
          class="text-[30px] !w-[30px] !h-[30px]"
          [ngClass]="{ 'text-white': gender === 'female' }"
        ></mat-icon>
        <input class="hidden" type="radio" name="gender" value="female" />
      </label>
    </div>
  </div>`,
  styles: ``,
})
export class GenderSelectionComponent {
  @Input() gender = Gender.Female;
  @Output() genderChange = new EventEmitter<Gender>();

  Gender = Gender;

  onSelectGender(gender: Gender) {
    this.genderChange.next(gender);
  }
}
