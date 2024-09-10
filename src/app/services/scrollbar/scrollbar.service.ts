import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollbarService {
  private scrollContainer: HTMLElement | null = null;
  private scrollTimeout = signal<NodeJS.Timeout | null>(null);

  scrolling = signal(false);

  setScrollContainer(container: HTMLElement) {
    this.scrollContainer = container;
    if (this.scrollContainer) {
      this.scrollContainer.addEventListener('scroll', () => {
        this.scrolling.set(true);

        this.scrollTimeout() && clearTimeout(this.scrollTimeout()!);
        const timeout = setTimeout(() => {
          this.scrolling.set(false);
        }, 300);
        this.scrollTimeout.set(timeout);
      });
    }
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
