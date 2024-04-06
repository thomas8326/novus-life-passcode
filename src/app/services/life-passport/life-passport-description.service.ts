import { Injectable, inject } from '@angular/core';
import { Database, ref, update } from '@angular/fire/database';
import { onValue } from 'firebase/database';
import { BehaviorSubject, map } from 'rxjs';
import {
  ID_TABLE_KEY_DETAIL_MAP,
  LIFE_PASSPORT_TABLE,
} from 'src/app/consts/life-passport';
import {
  IDKey,
  IdCalculationTable,
  LifePassportKey,
  LifePassportTable,
} from 'src/app/models/life-passport';

@Injectable({
  providedIn: 'root',
})
export class LifePassportDescriptionService {
  private database: Database = inject(Database);

  lifePassportAllTable: LifePassportTable = LIFE_PASSPORT_TABLE;
  private lifePassportTableSubject = new BehaviorSubject(
    this.lifePassportAllTable,
  );

  idCalculationAllTable = ID_TABLE_KEY_DETAIL_MAP;
  private idCalculationAllTableSubject = new BehaviorSubject(
    this.idCalculationAllTable,
  );

  constructor() {}

  listenAllPassportDescription() {
    const path = `life_passport`;
    const _ref = ref(this.database, path);

    const listener = () =>
      onValue(
        _ref,
        (snapshot) => {
          const data = snapshot.val() as LifePassportTable;
          this.lifePassportAllTable = { ...this.lifePassportAllTable, ...data };
          this.lifePassportTableSubject.next(this.lifePassportAllTable);
        },
        (error) => {
          this.lifePassportAllTable = LIFE_PASSPORT_TABLE;
          this.lifePassportTableSubject.next(this.lifePassportAllTable);
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

  listenAllIdCalculations() {
    const path = `id_calculation`;
    const _ref = ref(this.database, path);

    const listener = () =>
      onValue(
        _ref,
        (snapshot) => {
          const data = snapshot.val() as IdCalculationTable;
          this.idCalculationAllTable = {
            ...this.idCalculationAllTable,
            ...data,
          };
          this.idCalculationAllTableSubject.next(this.idCalculationAllTable);
        },
        (error) => {
          this.lifePassportAllTable = LIFE_PASSPORT_TABLE;
          this.idCalculationAllTableSubject.next(this.idCalculationAllTable);
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

  getAllIdCalculations() {
    return this.idCalculationAllTableSubject.asObservable();
  }

  getPassportDescription(number: number) {
    return this.lifePassportTableSubject.pipe(
      map((table) => table[`number_${number}`]),
    );
  }

  updatePassportDescription(
    number: number,
    updated: Partial<Record<LifePassportKey, string>>,
  ) {
    const path = `life_passport/number_${number}`;
    const updateRef = ref(this.database, path);
    update(updateRef, updated);
  }

  updateIdCalculation(updated: Partial<Record<IDKey, string>>) {
    const path = `id_calculation`;
    const updateRef = ref(this.database, path);
    // set(updateRef, updated);
    update(updateRef, updated);
  }
}
