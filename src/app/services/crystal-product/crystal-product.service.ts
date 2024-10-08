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
import dayjs from 'dayjs';
import { update } from 'firebase/database';
import { uploadBytes } from 'firebase/storage';
import { Observable } from 'rxjs';
import { isNil } from 'src/app/common/utilities';
import {
  CrystalAccessoryType,
  CrystalPendantType,
} from 'src/app/enums/accessory-type.enum';
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

  private tempAllCrystalMap = new Map<string, Crystal>();
  private tempAllCrystalAccessoryMap = new Map<string, CrystalAccessory>();

  constructor() {}

  getCrystalsByType(gender: Gender, type: LifeType) {
    const path = `crystals/${gender}_${type}`;
    const crystalsRef = databaseRef(this.database, path);

    return new Observable<Crystal[]>((subscriber) => {
      const listener = onValue(
        crystalsRef,
        (snapshot) => {
          const data = snapshot.val() as Record<string, Crystal>;
          const crystals: Crystal[] = [];
          Object.entries(data).forEach(([key, value]) => {
            this.tempAllCrystalMap.set(key, value);
            crystals.push({
              ...value,
              id: key,
              price: Number(value.price),
              mandatoryDiscount: Number(value.mandatoryDiscount),
              pendantDiscount: Number(value.pendantDiscount),
            });
          });

          subscriber.next(crystals);
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
          return { ...data, id };
        }
        throw new Error('No data available');
      });
    }

    return Promise.resolve({ ...crystal, id });
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
      mandatoryDiscount: 0,
      pendantDiscount: 0,
      type: CrystalPendantType.Satellite,
      mandatoryTypes: [],
      optionalTypes: [],
      pendantTypes: [],
      createdTime: dayjs().toISOString(),
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
    return update(updateRef, crystal);
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

    return new Observable<CrystalAccessory[]>((subscriber) => {
      const listener = onValue(
        accessoriesRef,
        (snapshot) => {
          const data = snapshot.val() as Record<string, CrystalAccessory>;
          const accessories: CrystalAccessory[] = [];
          Object.entries(data).forEach(([key, value]) => {
            this.tempAllCrystalAccessoryMap.set(key, value);
            accessories.push({ ...value, id: key, price: Number(value.price) });
          });

          subscriber.next(accessories);
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
      createdTime: dayjs().toISOString(),
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
    return update(updateRef, accessory);
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
