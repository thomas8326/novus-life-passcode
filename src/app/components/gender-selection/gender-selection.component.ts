import { CommonModule } from '@angular/common';
import { Component, model } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Gender } from 'src/app/enums/gender.enum';

@Component({
  selector: 'app-gender-selection',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: ` <div class="flex w-full justify-center">
    <div
      class="flex relative border border-gray-200 rounded overflow-hidden w-[200px] h-[80px]"
    >
      <label
        class="w-full h-full flex items-center justify-center cursor-pointer has-[:checked]:bg-blue-300 bg-stone-200"
        (click)="onSelectGender(Gender.Male)"
      >
        <mat-icon
          fontIcon="male"
          class="text-[30px] !w-[30px] !h-[30px]"
          [ngClass]="{ 'text-white': gender() === 'male' }"
        ></mat-icon>
        <input
          class="hidden"
          type="radio"
          name="gender"
          value="male"
          [checked]="gender() === Gender.Male"
        />
      </label>
      <div
        class="absolute px-1.5 w-fit h-fit inset-1/2 transform -translate-x-1/2 -translate-y-1/2 border rounded bg-gray-600 text-white"
      >
        OR
      </div>
      <label
        class="w-full h-full flex items-center justify-center cursor-pointer has-[:checked]:bg-red-300 bg-stone-200"
        (click)="onSelectGender(Gender.Female)"
      >
        <mat-icon
          fontIcon="female"
          class="text-[30px] !w-[30px] !h-[30px]"
          [ngClass]="{ 'text-white': gender() === 'female' }"
        ></mat-icon>
        <input
          class="hidden"
          type="radio"
          name="gender"
          value="female"
          [checked]="gender() === Gender.Female"
        />
      </label>
    </div>
  </div>`,
  styles: ``,
})
export class GenderSelectionComponent {
  gender = model(Gender.Female);
  Gender = Gender;

  onSelectGender(gender: Gender) {
    this.gender.set(gender);
  }
}
