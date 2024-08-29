import { Component, inject, signal } from '@angular/core';
import { UserFormService } from 'src/app/services/updates/user-form.service';

@Component({
  selector: 'app-update-box',
  standalone: true,
  imports: [],
  templateUrl: './update-box.component.html',
  styles: ``,
})
export class UpdateCleanFlowComponent {
  private updateUserFormService = inject(UserFormService);

  loading = signal(false);
  introduce = signal('');

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
