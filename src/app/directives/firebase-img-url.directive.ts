import { Directive, ElementRef, Input } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { take } from 'rxjs';

@Directive({
  selector: '[appFirebaseImgHref]',
  standalone: true,
})
export class FirebaseImgUrlDirective {
  @Input('imgHref') set imgHref(url: string | null | undefined) {
    if (url) {
      this.fireStorage
        .refFromURL(url)
        .getDownloadURL()
        .pipe(take(1))
        .subscribe((url) => {
          this.elementRef.nativeElement.href = url;
        });
    }
  }

  constructor(
    private readonly fireStorage: AngularFireStorage,
    private readonly elementRef: ElementRef,
  ) {}
}
