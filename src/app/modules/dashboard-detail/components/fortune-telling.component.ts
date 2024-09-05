import { Component, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DashboardDetailIdCalculationComponent } from 'src/app/modules/dashboard-detail/id-calculation/dashboard-detail-id-calculation.component';
import { DashboardDetailLifePasscodeComponent } from 'src/app/modules/dashboard-detail/life-passcode/dashboard-detail-life-passcode.component';

@Component({
  selector: 'app-fortune-telling',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex gap-2">
        <button
          type="button"
          (click)="openLifePasscode()"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          生命密碼
        </button>
        <button
          type="button"
          (click)="openIdCalculation()"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
        >
          身分證推算
        </button>
      </div>
    </div>
  `,
  styles: ``,
})
export class FortuneTellingComponent {
  private dialog = inject(MatDialog);

  userInfo = input<{
    name: string;
    birthday: string;
    nationalID: string;
  }>({
    name: '',
    birthday: '',
    nationalID: '',
  });

  openLifePasscode() {
    // 假設 LifePasscodeComponent 存在
    this.dialog.open(DashboardDetailLifePasscodeComponent, {
      data: {
        name: this.userInfo().name,
        birthday: this.userInfo().birthday,
        nationalID: this.userInfo().nationalID,
      },
      width: '100%',
      height: '100%',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }

  openIdCalculation() {
    // 假設 IdCalculationComponent 存在
    this.dialog.open(DashboardDetailIdCalculationComponent, {
      data: {
        name: this.userInfo().name,
        birthday: this.userInfo().birthday,
        nationalID: this.userInfo().nationalID,
      },
      width: '100%',
      height: '100%',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }
}
