import { Directive, ElementRef, Input } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { take } from 'rxjs';

@Directive({
  selector: '[appFirebaseImgUrl]',
  standalone: true,
})
export class FirebaseImgUrlDirective {
  @Input('imgUrl') set imgUrl(url: string | null | undefined) {
    if (url) {
      this.fireStorage
        .refFromURL(url)
        .getDownloadURL()
        .pipe(take(1))
        .subscribe((url) => {
          this.elementRef.nativeElement.src = url;
        });
    }
  }

  constructor(
    private readonly fireStorage: AngularFireStorage,
    private readonly elementRef: ElementRef,
  ) {}
}
