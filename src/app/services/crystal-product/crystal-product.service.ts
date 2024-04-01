import { Injectable, inject } from '@angular/core';
import { Database, off, onValue, push, ref } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { Gender } from 'src/app/consts/gender';
import { LifeType } from 'src/app/consts/life-type';
import { Crystal } from 'src/app/models/crystal';

@Injectable({
  providedIn: 'root',
})
export class CrystalProductService {
  private database: Database = inject(Database);

  constructor() {}

  getCrystals(gender: Gender, type: LifeType) {
    const path = `${gender}_${type}`;
    const crystalsRef = ref(this.database, path);

    return new Observable<Crystal[]>((subscriber) => {
      const listener = onValue(
        crystalsRef,
        (snapshot) => {
          const data = snapshot.val();
          subscriber.next(data);
        },
        (error) => {
          subscriber.error(error);
        },
      );

      // Cleanup subscription on unsubscribe
      return {
        unsubscribe() {
          off(crystalsRef, 'value', listener);
        },
      };
    });
  }

  addCrystal(crystal: Crystal, gender: Gender, type: LifeType) {
    const path = `${gender}_${type}`;
    const postsRef = ref(this.database, path);
    const newPostRef = push(postsRef);
    push(newPostRef, crystal);
  }

  removeCrystal(id: string) {}

  getCrystalAccessoryType() {
    return of();
  }
}
