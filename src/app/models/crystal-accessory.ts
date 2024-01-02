export interface CrystalAccessory {
  id: string;
  img: string;
  name: string;
  price: number;
}

export interface AllCrystalAccessoryType {
  satellites: CrystalAccessory[];
  foxes: CrystalAccessory[];
  braveTroops: CrystalAccessory[];
  nineTailed: CrystalAccessory[];
}
