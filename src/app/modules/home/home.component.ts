import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SlideShowComponent } from 'src/app/components/slide-show/slide-show.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CommonModule, MatIconModule, MatButtonModule, SlideShowComponent],
  standalone: true,
})
export class HomeComponent {
  page: 'home' | 'introduce' | 'product' | 'calculate' | 'aboutUs' = 'home';

  updatePage(page: typeof this.page) {
    this.page = page;
  }
}
