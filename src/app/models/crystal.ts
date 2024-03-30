import { FormArray, FormControl } from '@angular/forms';

export interface Crystal {
  id: string;
  image_url: string;
  name: string;
  descriptions: string[];
  contents: string[];
  contentWarnings: string[];
  contentNotes: string[];
  price: number;
}

export type FormGroupControls<T> = {
  [K in keyof T]: T[K] extends Array<infer U> ? FormArray : FormControl;
};

export interface AllCrystalType {
  health: Crystal[];
  friends: Crystal[];
  wealth: Crystal[];
}
