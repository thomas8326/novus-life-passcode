import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, switchMap } from 'rxjs';
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
};

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
  lifePassportNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  currentCode = new BehaviorSubject(0);
  fields: { key: LifePassportKey; text: string }[] = this.getCurrentKeys(
    this.currentCode.value,
  );
  codeBook: Record<LifePassportKey, string> | null = null;

  constructor(private descriptionService: LifePassportDescriptionService) {
    this.currentCode
      .pipe(
        switchMap((code) =>
          this.descriptionService.getPassportDescription(code),
        ),
      )
      .subscribe((codeBook) => {
        this.codeBook = codeBook;
      });
  }

  onSelectCode(code: number) {
    this.fields = this.getCurrentKeys(code);
    this.currentCode.next(code);
  }

  getCurrentKeys(currentNum: number) {
    const showArray: LifePassportKey[] = [LifePassportKey.無數字];

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

    return showArray.map((code) => ({
      key: code,
      text: passportTextMap[code] || '',
    }));
  }

  updateCodeDescription(code: LifePassportKey, newValue: string) {
    this.descriptionService.updatePassportDescription(this.currentCode.value, {
      [code]: newValue,
    });
  }
}
