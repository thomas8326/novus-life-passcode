import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { switchMap } from 'rxjs';
import { LifePassportKey } from 'src/app/models/life-passport';
import { LifePassportDescriptionService } from 'src/app/services/life-passport/life-passport-description.service';

const passportTextMap = {
  [LifePassportKey.三角]: '有三角',
  [LifePassportKey.圓圈]: '有圓圈',
  [LifePassportKey.圓圈多]: '3個以上圓圈',
  [LifePassportKey.圓圈少]: '1 ~ 2個圓圈',
  [LifePassportKey.方形]: '有方形',
  [LifePassportKey.方形三角]: '有方形與三角',
  [LifePassportKey.方形三角圓圈]: '有方形，三角與圓圈',
  [LifePassportKey.方形圓圈]: '有方形與圓圈',
  [LifePassportKey.無數字]: '空',
  [LifePassportKey.有連線]: '有連線',
  [LifePassportKey.無連線]: '無連線',
};

const lifePassportNumbers = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 123, 147, 159, 1590, 258, 456, 3690,
];

@Component({
  selector: 'app-update-passport-description',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
  ],
  templateUrl: './update-passport-description.component.html',
  styles: ``,
})
export class UpdatePassportDescriptionComponent {
  private descriptionService = inject(LifePassportDescriptionService);

  currentCode = signal(0);
  fields = computed(() => this.getCurrentKeys(this.currentCode()));
  codeBook = signal<Partial<Record<LifePassportKey, string>>>({});

  lifePassportNumbers = lifePassportNumbers;

  constructor() {
    toObservable<number>(this.currentCode)
      .pipe(
        switchMap((code) =>
          this.descriptionService.getPassportDescription(code),
        ),
      )
      .subscribe((data) => {
        this.codeBook.set(data);
      });
  }

  onSelectCode(code: number) {
    this.currentCode.set(code);
  }

  submitCodeDescription(code: LifePassportKey, newValue: string) {
    const currentCode = this.currentCode();
    this.descriptionService.updatePassportDescription(currentCode, {
      [code]: newValue,
    });
  }

  private getCurrentKeys(currentNum: number) {
    const showArray: LifePassportKey[] = [];

    if ([123, 147, 159, 1590, 258, 456, 3690].includes(currentNum)) {
      showArray.push(LifePassportKey.有連線, LifePassportKey.無連線);
    } else {
      showArray.push(LifePassportKey.無數字);

      if ([0, 1, 4, 8, 9].includes(currentNum)) {
        showArray.push(LifePassportKey.圓圈少, LifePassportKey.圓圈多);
      } else {
        showArray.push(LifePassportKey.圓圈);
      }

      showArray.push(
        LifePassportKey.三角,
        LifePassportKey.方形,
        LifePassportKey.方形圓圈,
        LifePassportKey.方形三角,
        LifePassportKey.方形三角圓圈,
      );
    }

    return showArray.map((code) => ({
      key: code,
      text: passportTextMap[code] || '',
    }));
  }
}
