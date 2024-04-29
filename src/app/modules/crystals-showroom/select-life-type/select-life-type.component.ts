import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { GenderSelectionComponent } from 'src/app/components/gender-selection/gender-selection.component';
import { LifeType } from 'src/app/enums/life-type.enum';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';

@Component({
  selector: 'app-select-life-type',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    FormsModule,
    CommonModule,
    GenderSelectionComponent,
    AsyncPipe,
  ],
  templateUrl: './select-life-type.component.html',
  styles: ``,
})
export class SelectLifeTypeComponent {
  LifeType = LifeType;

  constructor(public responsive: ResponsiveService) {}
}
