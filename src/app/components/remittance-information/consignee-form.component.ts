import { Component, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewBankSelectorComponent } from 'src/app/components/bank-selector/new-bank-selector.component';
import { InstallmentTutorialComponent } from 'src/app/components/installment-tutorial/installment-tutorial.component';
import { FormGroupControls } from 'src/app/models/form';
import { UserBank } from 'src/app/services/bank/bank.service';

@Component({
  selector: 'app-consignee-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    InstallmentTutorialComponent,
    ReactiveFormsModule,
    NewBankSelectorComponent,
  ],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
      <mat-form-field appearance="outline">
        <mat-label>姓名:</mat-label>
        <input matInput [formControl]="nameControl()" />
        @if (nameControl().hasError('required') && nameControl().touched) {
          <mat-error> 姓名為必填項 </mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>電話:</mat-label>
        <input matInput [formControl]="phoneControl()" />

        <mat-error>
          @if (phoneControl().touched) {
            @if (phoneControl().hasError('required')) {
              電話為必填項
            } @else if (phoneControl().hasError('numeric')) {
              請輸入數字
            } @else if (phoneControl().hasError('invalidPhone')) {
              請輸入台灣電話
            }
          }
        </mat-error>
      </mat-form-field>
    </div>

    <div class="mb-3">
      <app-bank-selector [bankFormGroup]="bankFormGroup()"></app-bank-selector>
    </div>
  `,
  styles: ``,
})
export class ConsigneeFormComponent {
  nameControl = input.required<FormControl<string>>();
  phoneControl = input.required<FormControl<string>>();
  bankFormGroup = input.required<FormGroup<FormGroupControls<UserBank>>>();
}
