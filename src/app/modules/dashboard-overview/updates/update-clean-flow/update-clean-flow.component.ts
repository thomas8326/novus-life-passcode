import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserFormService } from 'src/app/services/updates/user-form.service';

@Component({
  selector: 'app-update-clean-flow',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './update-clean-flow.component.html',
  styles: ``,
})
export class UpdateCleanFlowComponent implements OnDestroy {
  private updateUserFormService = inject(UserFormService);

  loading = signal(false);
  cleanFlow = signal('');
  boxIntroduce = signal<string>('');

  constructor() {
    this.loading.set(true);
    this.updateUserFormService.listenCleanFlow((data) => {
      this.cleanFlow.set(data);
      this.loading.set(false);
    });
    this.updateUserFormService.listenBoxIntroduce((data) => {
      this.boxIntroduce.set(data.introduction);
      this.loading.set(false);
    });
  }

  onSubmitCleanFlow() {
    const currentFlow = this.cleanFlow();
    if (currentFlow) {
      this.updateUserFormService.updateCleanFlow(currentFlow);
    }
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
