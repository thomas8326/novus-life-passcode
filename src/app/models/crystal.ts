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

export interface AllCrystalType {
  health: Crystal[];
  friends: Crystal[];
  wealth: Crystal[];
}


