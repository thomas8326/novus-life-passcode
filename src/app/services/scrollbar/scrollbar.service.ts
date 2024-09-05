import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollbarService {
  private scrollContainer: HTMLElement | null = null;

  setScrollContainer(container: HTMLElement) {
    this.scrollContainer = container;
  }

  scrollToTop() {
    const scrollbar = this.scrollContainer;
    if (scrollbar) {
      scrollbar.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } else {
      console.warn('Scroll container not set');
    }
  }
}
