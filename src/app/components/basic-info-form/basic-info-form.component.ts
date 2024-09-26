import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Gender } from 'src/app/enums/gender.enum';
import { BasicInfo } from 'src/app/models/account';
import { FormGroupControls } from 'src/app/models/form';

@Component({
  selector: 'app-basic-info-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  template: `
    <form [formGroup]="basicInfoForm()">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <mat-form-field appearance="outline">
          <mat-label>姓名:</mat-label>
          <input matInput formControlName="name" />
          @if (
            basicInfoForm().controls.name.hasError('required') &&
            basicInfoForm().controls.name.touched
          ) {
            <mat-error> 姓名為必填項 </mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>出生日期</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="birthday" />
          <mat-datepicker-toggle
            matSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          @if (
            basicInfoForm().controls.birthday.hasError('required') &&
            basicInfoForm().controls.birthday.touched
          ) {
            <mat-error> 出生日期為必填項 </mat-error>
          }
        </mat-form-field>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <mat-form-field appearance="outline">
          <mat-label>性別</mat-label>
          <mat-select formControlName="gender">
            <mat-option [value]="Gender.Male">男</mat-option>
            <mat-option [value]="Gender.Female">女</mat-option>
          </mat-select>
          @if (
            basicInfoForm().controls.gender.hasError('required') &&
            basicInfoForm().controls.gender.touched
          ) {
            <mat-error> 性別為必填項 </mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>身份證字號(輸入數字)</mat-label>
          <mat-hint [align]="'end'">
            {{ basicInfoForm().controls.nationalID.value.length || 0 }}/9
          </mat-hint>
          <input matInput formControlName="nationalID" />
          @if (basicInfoForm().controls.nationalID.hasError('required')) {
            <mat-error>請輸入身分證字號</mat-error>
          } @else if (basicInfoForm().controls.nationalID.hasError('numeric')) {
            <mat-error>請輸入數字</mat-error>
          } @else if (
            basicInfoForm().controls.nationalID.hasError('minlength') ||
            basicInfoForm().controls.nationalID.hasError('maxlength')
          ) {
            <mat-error>請輸入九個數字</mat-error>
          }
        </mat-form-field>
      </div>

      <div class="grid grid-cols-1 mb-3">
        <mat-form-field appearance="outline">
          <mat-label>電子郵件</mat-label>
          <input matInput formControlName="email" />
          @if (
            basicInfoForm().controls.email.hasError('required') &&
            basicInfoForm().controls.email.touched
          ) {
            <mat-error> 電子郵件為必填項 </mat-error>
          } @else if (
            basicInfoForm().controls.email.hasError('email') &&
            basicInfoForm().controls.email.touched
          ) {
            <mat-error> 請輸入有效的電子郵件地址 </mat-error>
          }
        </mat-form-field>
      </div>
    </form>
  `,
  styles: ``,
})
export class BasicInfoFormComponent {
  basicInfoForm = input.required<FormGroup<FormGroupControls<BasicInfo>>>();
  Gender = Gender;
}
