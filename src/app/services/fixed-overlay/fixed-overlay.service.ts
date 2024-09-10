import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  effect,
  inject,
  Injectable,
  signal,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ScrollbarService } from 'src/app/services/scrollbar/scrollbar.service';

@Injectable({
  providedIn: 'root',
})
export class FixedOverlayService {
  private overlayRef = signal<OverlayRef | null>(null);
  private overlay = inject(Overlay);
  private scrollbarService = inject(ScrollbarService);

  constructor() {
    effect(() => {
      const scrolling = this.scrollbarService.scrolling();
      if (scrolling) {
        this.close();
      }
    });
  }

  open(
    template: TemplateRef<any>,
    origin: HTMLElement,
    viewContainerRef: ViewContainerRef,
    config: Partial<{ push: boolean; scrollable: boolean }> = {
      push: true,
      scrollable: true,
    },
  ) {
    if (this.overlayRef()?.hasAttached()) {
      this.close();
      return;
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
      ]);

    positionStrategy.withPush(config.push);

    const ref = this.overlay.create({
      positionStrategy,
      scrollStrategy: config.scrollable
        ? this.overlay.scrollStrategies.close()
        : this.overlay.scrollStrategies.close(),
    });

    const templatePortal = new TemplatePortal(template, viewContainerRef);
    ref!.attach(templatePortal);
    this.overlayRef.set(ref);
  }

  close() {
    this.overlayRef() && this.overlayRef()!.dispose();
  }
}
