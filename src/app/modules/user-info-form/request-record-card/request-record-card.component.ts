import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { DividerComponent } from 'src/app/components/divider/divider.component';
import { QuerentInfoDisplayComponent } from 'src/app/components/querent-information/querent-info-display';
import { FirebaseImgUrlDirective } from 'src/app/directives/firebase-img-url.directive';
import { GenderMap } from 'src/app/enums/gender.enum';
import { RequestRecord } from 'src/app/models/account';
import { twMerge } from 'tailwind-merge';
import { RemittanceInfoDisplayComponent } from '../../../components/remittance-information/remittance-info-display';

@Component({
  selector: 'app-request-record-card',
  standalone: true,
  imports: [
    DividerComponent,
    DatePipe,
    FirebaseImgUrlDirective,
    QuerentInfoDisplayComponent,
    RemittanceInfoDisplayComponent,
  ],
  template: `
    @let recordData = record();
    @if (recordData) {
      <div
        class="w-full h-full rounded overflow-hidden text-[14px] sm:text-[16px]"
      >
        <div class="p-4 w-full">
          <app-querent-info-display
            [querent]="recordData.querent"
          ></app-querent-info-display>
          <app-divider textStyles="px-2"></app-divider>
          <app-remittance-info-display
            [remittance]="recordData.remittance"
          ></app-remittance-info-display>
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class RequestRecordCardComponent {
  record = input<RequestRecord | null>(null);
  GenderMap = GenderMap;

  twMerge = twMerge;
}
