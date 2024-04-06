import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
  idKeys = [
    { key: IDKey.財富智慧, text: '財富智慧' },
    { key: IDKey.生命力, text: '生命力' },
    { key: IDKey.貴人, text: '貴人' },
    { key: IDKey.平平等待, text: '平平等待' },
    { key: IDKey.禍害, text: '禍害' },
    { key: IDKey.六煞, text: '六煞' },
    { key: IDKey.絕命, text: '絕命' },
    { key: IDKey.五鬼, text: '五鬼' },
  ];

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
}
