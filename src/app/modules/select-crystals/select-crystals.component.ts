import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Gender } from 'src/app/consts/gender';
import { LifeType } from 'src/app/consts/life-type';

@Component({
  selector: 'app-crystals',
  templateUrl: './select-crystals.component.html',
  standalone: true,
  imports: [NgClass, MatIconModule, FormsModule, RouterLink],
})
export class SelectCrystalsComponent {
  gender: Gender = Gender.Male;
  LifeType = LifeType;
}
