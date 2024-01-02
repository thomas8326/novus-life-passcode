export interface Crystal {
  id: string;
  img: string;
  name: string;
  descriptions: string[];
  contents: string[];
  contentExcludes: string[];
  notes: string[];
  price: number;
}

export interface AllCrystalType {
  health: Crystal[];
  friends: Crystal[];
  wealth: Crystal[];
}
