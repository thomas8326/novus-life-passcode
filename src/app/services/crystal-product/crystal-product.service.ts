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
import { Observable } from 'rxjs';
import { CrystalAccessoryType } from 'src/app/enums/accessory-type.enum';
import { Gender } from 'src/app/enums/gender.enum';
import { LifeType } from 'src/app/enums/life-type.enum';
import { Crystal } from 'src/app/models/crystal';
import { CrystalAccessory } from 'src/app/models/crystal-accessory';

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

  onUpdateCrystalWithImage(
    id: string,
    file: File,
    crystal: Crystal,
    gender: Gender,
    type: LifeType,
  ) {
    const ref = storageRef(this.storage, `${gender}/` + file.name);
    const oldImage = crystal.image_url;
    return uploadBytes(ref, file).then((data) => {
      const { bucket, fullPath } = data.metadata;
      const gsUrl = `gs://${bucket}/${fullPath}`;
      this.updateCrystal(id, { ...crystal, image_url: gsUrl }, gender, type);
      this.removeOldImage(oldImage);
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

  private getCrystal(id: string) {
    return this.tempMap.get(id);
  }

  // Crystal Accessory Methods
  listenCrystalAccessories(type: CrystalAccessoryType) {
    const path = `${type}`;
    const accessoriesRef = databaseRef(this.database, path);

    return new Observable<Record<string, CrystalAccessory>>((subscriber) => {
      const listener = onValue(
        accessoriesRef,
        (snapshot) => {
          const data = snapshot.val() as Record<string, CrystalAccessory>;

          subscriber.next(data);
        },
        (error) => {
          subscriber.error(error);
        },
      );

      // Cleanup subscription on unsubscribe
      return {
        unsubscribe() {
          off(accessoriesRef, 'value', listener);
        },
      };
    });
  }

  onUpdateCrystalAccessoryWithImage(
    id: string,
    file: File,
    crystalAccessory: CrystalAccessory,
    type: CrystalAccessoryType,
  ) {
    const ref = storageRef(this.storage, `${type}/` + file.name);
    const oldImage = crystalAccessory.image_url;
    return uploadBytes(ref, file).then((data) => {
      const { bucket, fullPath } = data.metadata;
      const gsUrl = `gs://${bucket}/${fullPath}`;
      this.updateCrystalAccessory(
        id,
        { ...crystalAccessory, image_url: gsUrl },
        type,
      );
      this.removeOldImage(oldImage);
    });
  }

  addCrystalAccessory(type: CrystalAccessoryType) {
    const newCrystal: CrystalAccessory = {
      image_url: '',
      name: '',
      descriptions: [],
      price: 0,
    };
    const path = `${type}`;
    const postsRef = databaseRef(this.database, path);
    push(postsRef, newCrystal);
  }

  updateCrystalAccessory(
    id: string,
    accessory: Partial<CrystalAccessory>,
    type: CrystalAccessoryType,
  ) {
    const path = `${type}/${id}`;
    const updateRef = databaseRef(this.database, path);
    update(updateRef, accessory);
  }

  removeCrystalAccessory(
    id: string,
    imgUrl: string,
    type: CrystalAccessoryType,
  ) {
    const path = `${type}/${id}`;
    const removeRef = databaseRef(this.database, path);
    this.removeOldImage(imgUrl);
    remove(removeRef);
  }

  // Common Functions
  private removeOldImage(oldImg: string) {
    const oldImagePath = oldImg.split('appspot.com/')[1];
    if (oldImagePath) {
      const removedImagRef = storageRef(this.storage, oldImagePath);
      deleteObject(removedImagRef);
    }
  }
}
