import { FormArray, FormControl } from '@angular/forms';
import { CrystalAccessoryType } from 'src/app/enums/accessory-type.enum';

export interface Crystal {
  image_url: string;
  name: string;
  descriptions: string[];
  emphasizes: string[];
  contents: string[];
  contentWarnings: string[];
  contentNotes: string[];
  price: number;
  type: CrystalAccessoryType;
  mythicalBeastDiscount: number;
  pendantDiscount: number;
  order?: number;
}

export type FormGroupControls<T> = {
  [K in keyof T]: T[K] extends Array<infer U> ? FormArray : FormControl;
};

export interface AllCrystalType {
  health: Crystal[];
  friends: Crystal[];
  wealth: Crystal[];
}
