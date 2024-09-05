import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserFormService } from 'src/app/services/updates/user-form.service';
import { CheckboxComponent } from '../../../components/checkbox/checkbox.component';

@Component({
  selector: 'app-extra-introduction',
  standalone: true,
  imports: [FormsModule, CheckboxComponent],
  template: `
    <div class="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4">
      <h2 class="text-lg sm:text-xl font-semibold mb-4">淨化流程介紹</h2>
      <p class="whitespace-pre-wrap">{{ cleanFlow() }}</p>
    </div>
    <div class="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4">
      <h2 class="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-4">
        <span>加購寶盒</span>

        <label class="flex items-center cursor-pointer gap-1">
          <app-checkbox [(checked)]="wantsBox"></app-checkbox>
          <span>我想加購寶盒</span>
        </label>
      </h2>
      <p class="whitespace-pre-wrap">{{ boxIntroduce() }}</p>
    </div>
  `,
  styles: ``,
})
export class ExtraIntroductionComponent {
  wantsBox = model(false);

  private userForm = inject(UserFormService);

  cleanFlow = signal<string>('');
  boxIntroduce = signal<string>('');

  constructor() {
    this.userForm.listenCleanFlow((flow) => this.cleanFlow.set(flow));
    this.userForm.listenBoxIntroduce((data) =>
      this.boxIntroduce.set(data.introduction),
    );
  }
}
