import { Injectable, inject } from '@angular/core';
import {
  Database,
  ref as databaseRef,
  off,
  onValue,
  push,
  remove,
} from '@angular/fire/database';
import {
  Storage,
  deleteObject,
  ref as storageRef,
} from '@angular/fire/storage';
import { update } from 'firebase/database';
import { uploadBytes } from 'firebase/storage';
import { Observable, of } from 'rxjs';
import { Gender } from 'src/app/consts/gender';
import { LifeType } from 'src/app/consts/life-type';
import { Crystal } from 'src/app/models/crystal';

@Injectable({
  providedIn: 'root',
})
export class CrystalProductService {
  private database: Database = inject(Database);
  private storage: Storage = inject(Storage);
  private tempMap = new Map<string, Crystal>();

  constructor() {}

  getCrystals(gender: Gender, type: LifeType) {
    const path = `${gender}_${type}`;
    const crystalsRef = databaseRef(this.database, path);

    return new Observable<Map<string, Crystal>>((subscriber) => {
      const listener = onValue(
        crystalsRef,
        (snapshot) => {
          const data = snapshot.val() as Record<string, Crystal>;
          const newMap = new Map(Object.entries(data));
          newMap.forEach((value, key) => {
            this.tempMap.set(key, value);
          });

          subscriber.next(newMap);
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

  onUploadCrystalImage(
    id: string,
    file: File,
    oldImg: string,
    gender: Gender,
    type: LifeType,
  ) {
    const ref = storageRef(this.storage, `${gender}/` + file.name);
    return uploadBytes(ref, file).then((data) => {
      const { bucket, fullPath } = data.metadata;
      const gsUrl = `gs://${bucket}/${fullPath}`;
      this.updateCrystal(id, { image_url: gsUrl }, gender, type);
      this.removeOldImage(oldImg);
    });
  }

  addCrystal(gender: Gender, type: LifeType) {
    const newCrystal: Crystal = {
      image_url: '',
      name: '',
      descriptions: [],
      emphasizes: [],
      contents: [],
      contentWarnings: [],
      contentNotes: [],
      price: 0,
      accessoryDiscount: 0,
      order: -1,
    };
    const path = `${gender}_${type}`;
    const postsRef = databaseRef(this.database, path);
    push(postsRef, newCrystal);
  }

  updateCrystal(
    id: string,
    crystal: Partial<Crystal>,
    gender: Gender,
    type: LifeType,
  ) {
    const path = `${gender}_${type}/${id}`;
    const updateRef = databaseRef(this.database, path);
    update(updateRef, crystal);
  }

  removeCrystal(id: string, gender: Gender, type: LifeType) {
    const path = `${gender}_${type}/${id}`;
    const removeRef = databaseRef(this.database, path);

    const thisCrystal = this.getCrystal(id);
    if (thisCrystal) {
      this.removeOldImage(thisCrystal.image_url);
    }

    remove(removeRef);
  }

  getCrystalAccessoryType() {
    return of();
  }

  private getCrystal(id: string) {
    return this.tempMap.get(id);
  }

  private removeOldImage(oldImg: string) {
    const oldImagePath = oldImg.split('appspot.com/')[1];
    if (oldImagePath) {
      const removedImagRef = storageRef(this.storage, oldImagePath);
      deleteObject(removedImagRef);
    }
  }
}
