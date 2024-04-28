import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const breakPoints = {
  Mobile: '(max-width: 767px)',
  Tablet: '(min-width: 768px) and (max-width: 1023px)',
  Desktop: '(min-width: 1024px)',
};

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  // Observable sources
  private device = new BehaviorSubject<{
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  }>({
    mobile: false,
    tablet: false,
    desktop: true,
  });

  constructor(private breakpointObserver: BreakpointObserver) {
    this.watchScreenSize();
  }

  getDevice() {
    return this.device.value;
  }

  getDeviceObservable() {
    return this.device.asObservable();
  }

  private watchScreenSize(): void {
    // Listen for changes on specified breakpoints
    this.breakpointObserver
      .observe([breakPoints.Mobile, breakPoints.Tablet, breakPoints.Desktop])
      .subscribe((result) => {
        this.device.next({
          mobile: result.breakpoints[breakPoints.Mobile],
          tablet: result.breakpoints[breakPoints.Tablet],
          desktop: result.breakpoints[breakPoints.Desktop],
        });
      });
  }
}
