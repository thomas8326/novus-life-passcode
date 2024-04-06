import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ID_TEXT_MAP } from 'src/app/consts/life-passport';
import { IDKey, IdCalculationTable } from 'src/app/models/life-passport';
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
  idKeys = ID_TEXT_MAP;

  codeBook: IdCalculationTable | null = null;

  constructor(
    private readonly descriptionService: LifePassportDescriptionService,
  ) {
    this.descriptionService
      .getAllIdCalculations()
      .subscribe((codeBook) => (this.codeBook = codeBook));
  }

  onUpdateIdCalculation(idKey: IDKey, newValue: string) {
    this.descriptionService.updateIdCalculation({
      [idKey]: newValue,
    });
  }

  get idKeysMap() {
    return ID_TEXT_MAP.entries() as IterableIterator<[IDKey, string]>;
  }
}
