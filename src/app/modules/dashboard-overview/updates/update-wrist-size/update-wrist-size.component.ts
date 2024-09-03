import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserFormService } from 'src/app/services/updates/user-form.service';

@Component({
  selector: 'app-update-wrist-size',
  standalone: true,
  imports: [FormsModule, MatProgressSpinnerModule],
  template: `
    <div
      class="bg-white rounded-lg shadow-md px-4 py-3 space-y-2 relative my-2"
    >
      @if (loading()) {
        <div
          class="w-full h-full flex items-center justify-center py-10 flex-1 absolute top-0 left-0 z-10 bg-white"
        >
          <mat-spinner></mat-spinner>
        </div>
      }

      <div class="flex flex-col gap-1.5">
        <div class="font-bold">影片標題</div>
        <input
          matInput
          [(ngModel)]="title"
          class="px-2 py-1.5 border rounded-sm"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <div class="font-bold">影片連結</div>
        <input
          matInput
          [(ngModel)]="link"
          class="px-2 py-1.5 border rounded-sm"
        />
      </div>
      <div class="flex justify-end my-2">
        <button mat-stroked-button color="primary" (click)="onSubmitTutorial()">
          更新
        </button>
      </div>
    </div>
  `,
  styles: ``,
})
export class UpdateWristSizeComponent {
  private updateUserFormService = inject(UserFormService);

  loading = signal(false);
  link = signal('');
  title = signal('');

  constructor() {
    this.loading.set(true);
    this.updateUserFormService.listenTutorial((data) => {
      console.log('data', data);
      this.link.set(data.link);
      this.title.set(data.title);
      this.loading.set(false);
    });
  }

  ngOnDestroy(): void {
    this.updateUserFormService.unsubscribe();
  }

  onSubmitTutorial() {
    this.updateUserFormService.updateTutorial({
      link: this.link(),
      title: this.title(),
    });
  }
}
