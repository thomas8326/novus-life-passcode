export interface CrystalAccessory {
  id?: string;
  image_url: string;
  name: string;
  descriptions: string[];
  price: number;
  order?: number;
  createdTime: string;
}
