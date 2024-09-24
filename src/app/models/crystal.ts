import { CrystalAccessoryType } from 'src/app/enums/accessory-type.enum';

export interface Crystal {
  id?: string;

  image_url: string;
  name: string;
  descriptions: string[];
  emphasizes: string[];
  contents: string[];
  contentWarnings: string[];
  contentNotes: string[];
  price: number;
  type: CrystalAccessoryType;
  mandatoryDiscount: number;
  pendantDiscount: number;
  order?: number;
  mandatoryTypes: CrystalAccessoryType[];
  optionalTypes: CrystalAccessoryType[];
  pendantTypes: CrystalAccessoryType[];

  createdTime: string;
}

export interface AllCrystalType {
  health: Crystal[];
  friends: Crystal[];
  wealth: Crystal[];
}
