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

export const OptionalTypes = [
  {
    key: CrystalMythicalBeastType.BraveTroops,
    text: AccessoryTypeText[CrystalMythicalBeastType.BraveTroops],
  },
  {
    key: CrystalMythicalBeastType.CuteFox,
    text: AccessoryTypeText[CrystalMythicalBeastType.CuteFox],
  },
  {
    key: CrystalMythicalBeastType.NineTails,
    text: AccessoryTypeText[CrystalMythicalBeastType.NineTails],
  },
];

export const AllTypes = [
  {
    key: CrystalMythicalBeastType.BraveTroops,
    text: AccessoryTypeText[CrystalMythicalBeastType.BraveTroops],
  },
  {
    key: CrystalMythicalBeastType.CuteFox,
    text: AccessoryTypeText[CrystalMythicalBeastType.CuteFox],
  },
  {
    key: CrystalMythicalBeastType.NineTails,
    text: AccessoryTypeText[CrystalMythicalBeastType.NineTails],
  },
  {
    key: CrystalPendantType.Satellite,
    text: AccessoryTypeText[CrystalPendantType.Satellite],
  },
  {
    key: CrystalPendantType.Gold,
    text: AccessoryTypeText[CrystalPendantType.Gold],
  },
  {
    key: CrystalPendantType.Sliver,
    text: AccessoryTypeText[CrystalPendantType.Sliver],
  },
];
