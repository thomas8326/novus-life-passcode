import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserFormService } from 'src/app/services/updates/user-form.service';

@Component({
  selector: 'app-box-introduction',
  standalone: true,
  imports: [FormsModule, MatProgressSpinnerModule],
  template: `
    <div class="space-y-2">
      <div class="bg-white rounded-lg shadow-md px-4 py-3 space-y-2 relative">
        @if (loading()) {
          <div
            class="w-full h-full flex items-center justify-center py-10 flex-1 absolute top-0 left-0 z-10 bg-white"
          >
            <mat-spinner></mat-spinner>
          </div>
        }

        <div class="flex flex-col gap-1.5">
          <div class="font-bold">加購寶盒</div>
          <textarea
            matInput
            rows="10"
            [(ngModel)]="boxIntroduce"
            class="px-2 py-1.5 border rounded-sm"
          ></textarea>
        </div>
        <div class="flex justify-end my-2">
          <button
            mat-stroked-button
            color="primary"
            (click)="onSubmitBoxIntroduce()"
          >
            更新
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class UpdateBoxIntroductionComponent implements OnDestroy {
  private updateUserFormService = inject(UserFormService);

  loading = signal(false);
  boxIntroduce = signal<string>('');

  constructor() {
    this.loading.set(true);
    this.updateUserFormService.listenBoxIntroduce((data) => {
      this.boxIntroduce.set(data.introduction);
      this.loading.set(false);
    });
  }

  onSubmitBoxIntroduce() {
    const introduce = this.boxIntroduce();
    if (introduce) {
      this.updateUserFormService.updateBoxIntroduce({
        introduction: introduce,
      });
    }
  }

  ngOnDestroy(): void {
    this.updateUserFormService.unsubscribe();
  }
}
