import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ID_TEXT_MAP } from 'src/app/consts/life-passport.const';
import { IDKey } from 'src/app/models/life-passport';
import { LifePassportDescriptionService } from 'src/app/services/life-passport/life-passport-description.service';

@Component({
  selector: 'app-update-id-calculation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
  ],
  templateUrl: './update-id-calculation.component.html',
  styles: ``,
})
export class UpdateIdCalculationComponent {
  private descriptionService = inject(LifePassportDescriptionService);

  idKeys = ID_TEXT_MAP;
  codeBook = toSignal(this.descriptionService.getAllIdCalculations(), {
    initialValue: null,
  });

  localCodeBook = signal<Record<IDKey, string> | null>(null);

  onUpdateIdCalculation(idKey: IDKey, newValue: string) {
    const codeBook = this.codeBook();
    if (codeBook) {
      this.localCodeBook.set({ ...codeBook, [idKey]: newValue });
    }
  }

  onSubmitIdCalculation() {
    const codeBook = this.localCodeBook();
    if (codeBook) {
      this.descriptionService.updateIdCalculation(codeBook);
    }
  }

  get idKeysMap() {
    return ID_TEXT_MAP.entries() as IterableIterator<[IDKey, string]>;
  }
}
