import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { of } from 'rxjs';
import { Gender } from 'src/app/consts/gender';
import { LifeType } from 'src/app/consts/life-type';
import { Crystal } from 'src/app/models/crystal';

@Injectable({
  providedIn: 'root',
})
export class CrystalService {

  constructor(private readonly db: AngularFireDatabase) {
  }

  getCrystals(gender: Gender, type: LifeType) {
    let path = `${gender}_${type}`;
    return this.db.list<Crystal>(path).valueChanges();
  }

  getCrystalAccessoryType() {
    return of();
  }
}
