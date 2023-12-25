import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Crystal } from 'src/app/models/crystal';

@Component({
  selector: 'app-crystal-product-card',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './crystal-product-card.component.html',
  styles: ``,
})
export class CrystalProductCardComponent {
  @Input() crystal: Crystal | null = null;
}
