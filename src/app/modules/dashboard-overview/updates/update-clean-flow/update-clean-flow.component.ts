import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  CleanFlow,
  UserFormService,
} from 'src/app/services/updates/user-form.service';

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
export class UpdateCleanFlowComponent {
  private updateUserFormService = inject(UserFormService);

  loading = signal(false);
  cleanFlow = signal<CleanFlow>({
    flow: '',
    tutorial: { link: '', title: '' },
  });

  constructor() {
    this.loading.set(true);
    this.updateUserFormService.listenCleanFlow((data) => {
      this.cleanFlow.set(data);
      this.updateUserFormService.unsubscribe();
      this.loading.set(false);
    });
  }

  onUpdateCleanFlow(flow: string) {
    this.cleanFlow.update((cleanFlow) => ({ ...cleanFlow, flow }));
  }

  onSubmitCleanFlow() {
    const currentFlow = this.cleanFlow();
    if (currentFlow?.flow) {
      this.updateUserFormService.updateCleanFlow(currentFlow.flow);
    }
  }

  onUpdateTutorial(tutorial: Partial<{ link: ''; title: '' }>) {
    this.cleanFlow.update((cleanFlow) => ({
      ...cleanFlow,
      tutorial: { ...cleanFlow.tutorial, ...tutorial },
    }));
  }

  onSubmitTutorial() {
    const currentFlow = this.cleanFlow();
    if (currentFlow?.tutorial) {
      this.updateUserFormService.updateCleanFlowTutorial(currentFlow.tutorial);
    }
  }
}
