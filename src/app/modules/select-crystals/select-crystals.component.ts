import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-crystals',
  templateUrl: './select-crystals.component.html',
  standalone: true,
  imports: [NgClass, MatIconModule, FormsModule],
})
export class SelectCrystalsComponent {
  gender: string = 'male';
}
