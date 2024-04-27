import { Injectable, inject } from '@angular/core';
import {
  Database,
  child,
  ref as databaseRef,
  get,
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
import { isNil } from 'ramda';
import { Observable, of } from 'rxjs';
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

  private tempAllCrystalWithTypeMap: Record<string, Map<string, Crystal>> = {};
  private tempAllCrystalMap = new Map<string, Crystal>();
  private isGetAllCrystals = false;

  private tempAllCrystalAccessoryWithTypeMap: Record<
    string,
    Map<string, CrystalAccessory>
  > = {};
  private tempAllCrystalAccessoryMap = new Map<string, CrystalAccessory>();
  private isGetAllCrystalAccessories = false;

  constructor() {}

  getCrystalsByType(gender: Gender, type: LifeType) {
    const path = `crystals/${gender}_${type}`;
    const crystalsRef = databaseRef(this.database, path);

    if (this.tempAllCrystalWithTypeMap[path]) {
      return of(this.tempAllCrystalWithTypeMap[path]);
    }

    return new Observable<Map<string, Crystal>>((subscriber) => {
      const listener = onValue(
        crystalsRef,
        (snapshot) => {
          const data = snapshot.val() as Record<string, Crystal>;
          const newMap = new Map(Object.entries(data));
          this.tempAllCrystalWithTypeMap[path] = newMap;
          newMap.forEach((value, key) => {
            this.tempAllCrystalMap.set(key, value);
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

  getCrystal(category: string, id: string) {
    const crystal = this.tempAllCrystalMap.get(id);

    if (isNil(crystal)) {
      const crystalsRef = databaseRef(this.database);
      const path = `crystals/${category}/${id}`;
      return get(child(crystalsRef, path)).then((snapshot) => {
        if (snapshot.exists()) {
          const data: Crystal = snapshot.val();
          this.tempAllCrystalMap.set(id, data);
          return data;
        }
        throw new Error('No data available');
      });
    }

    return Promise.resolve(crystal);
  }

  getAllCrystals() {
    const path = `crystals`;
    const crystalsRef = databaseRef(this.database);

    if (this.isGetAllCrystals) {
      return Promise.resolve(this.tempAllCrystalMap);
    }

    return get(child(crystalsRef, path)).then((snapshot) => {
      if (snapshot.exists()) {
        const data: Record<string, Record<string, Crystal>> = snapshot.val();
        Object.entries(data).forEach(([key, value]) => {
          if (this.tempAllCrystalWithTypeMap[key]) {
            return;
          }

          this.tempAllCrystalWithTypeMap[key] = new Map(Object.entries(value));
          this.tempAllCrystalWithTypeMap[key].forEach((v, k) => {
            this.tempAllCrystalMap.set(k, v);
          });
        });

        this.isGetAllCrystals = true;
        return this.tempAllCrystalMap;
      }
      throw new Error('No data available');
    });
  }

  onUpdateCrystalWithImage(
    id: string,
    file: File,
    crystal: Crystal,
    gender: Gender,
    type: LifeType,
  ) {
    const ref = storageRef(this.storage, `crystals/${gender}/` + file.name);
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
    const path = `crystals/${gender}_${type}`;
    const postsRef = databaseRef(this.database, path);
    push(postsRef, newCrystal);
  }

  updateCrystal(
    id: string,
    crystal: Partial<Crystal>,
    gender: Gender,
    type: LifeType,
  ) {
    const path = `crystals/${gender}_${type}/${id}`;
    const updateRef = databaseRef(this.database, path);
    update(updateRef, crystal);
  }

  removeCrystal(id: string, gender: Gender, type: LifeType) {
    const path = `crystals/${gender}_${type}/${id}`;
    const removeRef = databaseRef(this.database, path);

    this.getCrystal(`${gender}_${type}`, id).then((crystal) => {
      if (crystal) {
        this.removeOldImage(crystal.image_url);
      }
    });

    remove(removeRef);
  }

  // Crystal Accessory Methods
  getCrystalAccessoriesByType(type: CrystalAccessoryType) {
    const path = `crystal-accessories/${type}`;
    const accessoriesRef = databaseRef(this.database, path);

    return new Observable<Record<string, CrystalAccessory>>((subscriber) => {
      const listener = onValue(
        accessoriesRef,
        (snapshot) => {
          const data = snapshot.val() as Record<string, CrystalAccessory>;
          const newMap = new Map(Object.entries(data));
          this.tempAllCrystalAccessoryWithTypeMap[path] = newMap;
          newMap.forEach((value, key) => {
            this.tempAllCrystalAccessoryMap.set(key, value);
          });

          subscriber.next(data);
        },
        (error) => {
          subscriber.error(error);
        },
      );

      return {
        unsubscribe() {
          off(accessoriesRef, 'value', listener);
        },
      };
    });
  }

  getCrystalAccessory(id: string) {
    return this.tempAllCrystalAccessoryMap.get(id);
  }

  getAllCrystalAccessories() {
    const path = `crystal-accessories`;
    const crystalsRef = databaseRef(this.database);

    if (this.isGetAllCrystalAccessories) {
      return Promise.resolve(this.tempAllCrystalAccessoryMap);
    }

    return get(child(crystalsRef, path)).then((snapshot) => {
      if (snapshot.exists()) {
        const data: Record<string, Record<string, Crystal>> = snapshot.val();
        Object.entries(data).forEach(([key, value]) => {
          if (this.tempAllCrystalAccessoryWithTypeMap[key]) {
            return;
          }

          this.tempAllCrystalAccessoryWithTypeMap[key] = new Map(
            Object.entries(value),
          );
          this.tempAllCrystalAccessoryWithTypeMap[key].forEach((v, k) => {
            this.tempAllCrystalAccessoryMap.set(k, v);
          });
        });

        this.isGetAllCrystalAccessories = true;
        return this.tempAllCrystalAccessoryMap;
      }
      throw new Error('No data available');
    });
  }

  onUpdateCrystalAccessoryWithImage(
    id: string,
    file: File,
    crystalAccessory: CrystalAccessory,
    type: CrystalAccessoryType,
  ) {
    const ref = storageRef(
      this.storage,
      `crystal-accessories/${type}/` + file.name,
    );
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
    const path = `crystal-accessories/${type}`;
    const postsRef = databaseRef(this.database, path);
    push(postsRef, newCrystal);
  }

  updateCrystalAccessory(
    id: string,
    accessory: Partial<CrystalAccessory>,
    type: CrystalAccessoryType,
  ) {
    const path = `crystal-accessories/${type}/${id}`;
    const updateRef = databaseRef(this.database, path);
    update(updateRef, accessory);
  }

  removeCrystalAccessory(
    id: string,
    imgUrl: string,
    type: CrystalAccessoryType,
  ) {
    const path = `crystal-accessories/${type}/${id}`;
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
