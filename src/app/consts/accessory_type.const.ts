import {
  CrystalAccessoryType,
  CrystalMythicalBeastType,
  CrystalPendantType,
} from 'src/app/enums/accessory-type.enum';

export const AccessoryTypeText: Record<CrystalAccessoryType, string> = {
  [CrystalPendantType.Satellite]: '大衛星',
  [CrystalPendantType.Sliver]: '銀吊飾',
  [CrystalPendantType.Gold]: '注金吊飾',
  [CrystalMythicalBeastType.CuteFox]: '萌狐',
  [CrystalMythicalBeastType.BraveTroops]: '貔貅',
  [CrystalMythicalBeastType.NineTails]: '九尾狐',
};
