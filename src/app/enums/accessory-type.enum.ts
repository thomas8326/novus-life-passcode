export enum CrystalMythicalBeastType {
  BraveTroops = 'brave_troops',
  CuteFox = 'cute_fox',
  NineTails = 'nine_tails',
}
export enum CrystalPendantType {
  Satellite = 'satellite',
  Sliver = 'sliver',
  Gold = 'gold',
}

export type CrystalAccessoryType =
  | CrystalMythicalBeastType
  | CrystalPendantType;
