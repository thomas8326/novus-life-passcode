export interface CrystalAccessory {
  image_url: string;
  name: string;
  descriptions: string[];
  price: number;
  order?: number;
}

export type CrystalAccessoryType = '大衛星' | '萌狐' | '貔貅' | '九尾狐';
