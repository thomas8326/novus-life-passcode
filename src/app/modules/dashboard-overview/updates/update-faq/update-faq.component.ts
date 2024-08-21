import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FAQ,
  UserFormService,
} from 'src/app/services/updates/user-form.service';

@Component({
  selector: 'app-update-faq',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './update-faq.component.html',
  styles: ``,
})
export class UpdateFaqComponent {
  private fb = inject(FormBuilder);
  private updateUserFormService = inject(UserFormService);

  question = signal('');
  answer = signal('');
  category = signal('');

  faqForm = this.fb.group({
    faqs: this.fb.array([]),
  });

  faqsData = signal<Record<string, FAQ> | null>(null);

  loading = computed(() => this.faqsData() === null);

  constructor() {
    this.initFaqs();
  }

  get faqs() {
    return this.faqForm.get('faqs') as FormArray;
  }

  initFaqs() {
    this.updateUserFormService.listenFAQs((faqs) => {
      this.faqsData.set(faqs);

      if (faqs && this.faqs.length === 0) {
        this.faqs.clear();
        Object.entries(faqs).forEach(([key, faq]) => {
          this.faqs.push(
            this.fb.group({
              id: [key],
              question: [faq.question, Validators.required],
              answer: [faq.answer, Validators.required],
              category: [faq?.category || ''],
            }),
          );
        });
      }
    });
  }

  addFaq() {
    if (this.answer() === '' || this.question() === '') return;

    this.updateUserFormService.addFaq(
      this.question(),
      this.answer(),
      this.category(),
    );
    this.question.set('');
    this.answer.set('');
    this.category.set('');
  }

  removeFaq(id: string) {
    this.updateUserFormService.removeFaq(id);
  }

  updateFaq(faq: FAQ) {
    this.updateUserFormService.updateFaq(faq);
  }
}
