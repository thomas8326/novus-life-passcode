import { CommonModule } from '@angular/common';
import { Component, inject, model, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserFormService } from 'src/app/services/updates/user-form.service';

@Component({
  selector: 'app-update-introduction',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="bg-white rounded-lg shadow-md px-4 py-3 space-y-2 relative">
      @if (loading()) {
        <div
          class="w-full h-full flex items-center justify-center py-10 flex-1 absolute top-0 left-0 z-10 bg-white"
        >
          <mat-spinner></mat-spinner>
        </div>
      }

      <div class="flex flex-col gap-1.5">
        <div class="font-bold">介紹</div>
        <textarea
          matInput
          rows="10"
          [value]="introduction()"
          (change)="updateIntroduction(textarea.value)"
          class="px-2 py-1.5 border rounded-sm"
          #textarea
        ></textarea>
      </div>
      <div class="flex justify-end my-2">
        <button mat-stroked-button color="primary" (click)="update()">
          更新
        </button>
      </div>
    </div>
  `,
  styles: ``,
})
export class UpdateIntroductionComponent implements OnDestroy {
  private updateUserFormService = inject(UserFormService);

  loading = signal(true);
  introduction = model('');

  private cleanup: (() => void) | null = null;

  constructor() {
    this.updateUserFormService.listenIntroduction((data) => {
      this.introduction.set(data);
      this.loading.set(false);
      this.updateUserFormService.unsubscribe();
    });
  }

  updateIntroduction(value: string) {
    this.introduction.set(value);
  }

  update() {
    this.updateUserFormService.updateIntroduction(this.introduction());
  }

  ngOnDestroy(): void {
    if (this.cleanup) {
      this.cleanup();
    }
    this.updateUserFormService.unsubscribe();
  }
}
