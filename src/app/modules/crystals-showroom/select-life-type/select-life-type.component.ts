import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { GenderSelectionComponent } from 'src/app/components/gender-selection/gender-selection.component';
import { Gender } from 'src/app/consts/gender';
import { LifeType } from 'src/app/consts/life-type';

@Component({
  selector: 'app-select-life-type',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    FormsModule,
    CommonModule,
    GenderSelectionComponent,
  ],
  templateUrl: './select-life-type.component.html',
  styles: ``,
})
export class SelectLifeTypeComponent {
  LifeType = LifeType;
  gender = Gender.Male;
}
