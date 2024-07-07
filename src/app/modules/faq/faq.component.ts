import { KeyValuePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {
  FAQ,
  UserFormService,
} from 'src/app/services/updates/user-form.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [KeyValuePipe, MatExpansionModule, MatIconModule],
  templateUrl: './faq.component.html',
  styles: ``,
})
export class FaqComponent {
  keyword = signal('');
  faqs = signal<[string, FAQ[]][]>([]);

  filterFaqs = computed(() => {
    const _keyword = this.keyword().toLowerCase();
    if (!_keyword) {
      return this.faqs();
    } else {
      return this.faqs()
        .map<[string, FAQ[]]>(([category, faqs]) => [
          category,
          faqs.filter(
            (faq) =>
              faq.question.toLowerCase().includes(_keyword) ||
              faq.answer.toLowerCase().includes(_keyword) ||
              faq.category.toLowerCase().includes(_keyword),
          ),
        ])
        .filter(([_, filter]) => filter.length > 0);
    }
  });

  constructor(private userForm: UserFormService) {
    this.userForm.listenFAQs((faqs) => {
      const record = Object.entries(faqs).reduce(
        (acc, data) => {
          const [id, faq] = data;
          const category = faq.category || '未分類';

          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({ id, ...faq });
          return acc;
        },
        {} as Record<string, FAQ[]>,
      );
      this.faqs.set(Object.entries(record));
    });
  }
}
