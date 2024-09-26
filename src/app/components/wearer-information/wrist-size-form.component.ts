import { Component, inject, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  Tutorial,
  UserFormService,
} from 'src/app/services/updates/user-form.service';

@Component({
  selector: 'app-wrist-size-form',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  template: `
    <div class="flex flex-col gap-3 mb-3">
      <div>
        <div
          class="text-mobileSmall sm:text-desktopSmall flex items-center gap-1"
        >
          <span class="text-gray-500">請參考教學影片:</span>
          <a
            [href]="tutorial()?.link"
            target="_blank"
            class="cursor-pointer text-blue-600 myi-4"
          >
            {{ tutorial()?.title }}
          </a>
        </div>

        <div class="text-mobileSmall sm:text-desktopSmall text-gray-500">
          請量測配戴的手，若右撇子為配戴左手，若左撇子為配戴右手，若雙手慣用者請配戴左手。
        </div>
      </div>

      <div>
        <mat-form-field appearance="outline">
          <mat-label>手圍</mat-label>
          <input matInput [formControl]="wristSizeControl()" type="number" />
          @if (
            wristSizeControl().hasError('required') &&
            wristSizeControl().touched
          ) {
            <mat-error>請填入你的手圍</mat-error>
          } @else if (
            wristSizeControl().hasError('numeric') && wristSizeControl().touched
          ) {
            <mat-error>請輸入數字</mat-error>
          }
        </mat-form-field>
      </div>
    </div>
  `,
  styles: ``,
})
export class WristSizeFormComponent {
  wristSizeControl = input.required<FormControl<string | number>>();

  tutorial = signal<Tutorial | null>(null);
  updatedForm = inject(UserFormService);

  constructor() {
    this.updatedForm.listenTutorial((data) => {
      this.tutorial.set(data);
    });
  }
}
