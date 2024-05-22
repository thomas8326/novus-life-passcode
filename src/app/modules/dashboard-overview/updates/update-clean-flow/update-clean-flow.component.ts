import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject } from 'rxjs';
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
export class UpdateCleanFlowComponent implements OnDestroy {
  private readonly loadingSubject = new BehaviorSubject(false);
  loading$ = this.loadingSubject.asObservable();

  showFlow = '';

  cleanFlow: CleanFlow = { flow: '', tutorial: { link: '', title: '' } };

  constructor(private readonly updateUserFormService: UserFormService) {
    this.loadingSubject.next(true);
    this.updateUserFormService.listenCleanFlow((data) => {
      this.cleanFlow = data;
      this.updateUserFormService.unsubscribe();
      this.loadingSubject.next(false);
    });
  }

  updateCleanFlow() {
    if (this.cleanFlow?.flow) {
      this.updateUserFormService.updateCleanFlow(this.cleanFlow.flow);
    }
  }

  updateTutorial() {
    if (this.cleanFlow?.tutorial) {
      this.updateUserFormService.updateCleanFlowTutorial(
        this.cleanFlow.tutorial,
      );
    }
  }

  ngOnDestroy(): void {}
}
