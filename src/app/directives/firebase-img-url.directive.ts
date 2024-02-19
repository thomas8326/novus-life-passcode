import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { take } from 'rxjs';


@Directive({
  selector: '[appFirebaseImgUrl]',
  standalone: true
})
export class FirebaseImgUrlDirective implements OnInit{

  @Input() imgUrl: string | null = null;

  constructor(private readonly fireStorage: AngularFireStorage, private readonly elementRef: ElementRef) { }

  ngOnInit(): void {
    if(this.imgUrl) {
      this.fireStorage.refFromURL(this.imgUrl).getDownloadURL().pipe(take(1)).subscribe(url => {
        this.elementRef.nativeElement.src = url;
      });
    }
  }
}
