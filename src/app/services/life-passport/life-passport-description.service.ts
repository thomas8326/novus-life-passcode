import { Injectable, inject } from '@angular/core';
import { Database, ref, update } from '@angular/fire/database';
import { onValue } from 'firebase/database';
import { BehaviorSubject, map } from 'rxjs';
import { LIFE_PASSPORT_TABLE } from 'src/app/consts/life-passport';
import {
  LifePassportKey,
  LifePassportTable,
} from 'src/app/models/life-passport';

@Injectable({
  providedIn: 'root',
})
export class LifePassportDescriptionService {
  private database: Database = inject(Database);

  allTable: LifePassportTable = LIFE_PASSPORT_TABLE;
  allTableSubject = new BehaviorSubject(this.allTable);

  constructor() {}

  getAllPassportDescription() {
    const path = `life_passport`;
    const _ref = ref(this.database, path);

    const listener = () =>
      onValue(
        _ref,
        (snapshot) => {
          const data = snapshot.val() as LifePassportTable;
          this.allTable = data;
          this.allTableSubject.next(this.allTable);
        },
        (error) => {
          this.allTable = LIFE_PASSPORT_TABLE;
          this.allTableSubject.next(this.allTable);
        },
      );

    return {
      subscribe: listener,
      unsubscribe: () => {
        const unsubscribe = listener();
        unsubscribe();
      },
    };
  }

  getPassportDescription(number: number) {
    return this.allTableSubject.pipe(map((table) => table[`number_${number}`]));
  }

  updatePassportDescription(
    number: number,
    updated: Partial<Record<LifePassportKey, string>>,
  ) {
    const path = `life_passport/number_${number}`;
    const updateRef = ref(this.database, path);
    update(updateRef, updated);
  }
}
