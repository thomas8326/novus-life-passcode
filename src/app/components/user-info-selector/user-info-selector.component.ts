import { Component, computed, inject, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BasicInfo, Consignee } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-user-info-selector',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  template: `
    <div class="flex flex-wrap gap-2 mb-4">
      @for (item of data(); track $index) {
        <button
          class="recipient-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300"
          (click)="userInfoChange.emit(item)"
        >
          {{ item.name }}
        </button>
      }
    </div>
  `,
  styles: ``,
})
export class UserInfoSelectorComponent {
  type = input<'basic' | 'consignee'>('basic');
  userInfoChange = output<Consignee | BasicInfo>();

  accountService = inject(AccountService);

  data = computed(() => {
    const type = this.type();
    const data =
      type === 'basic'
        ? this.accountService.getMyAccount()?.basicInfos
        : this.accountService.getMyAccount()?.consignees;

    return data?.filter((item) => !!item.name);
  });
}
