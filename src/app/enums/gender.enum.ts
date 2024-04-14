export enum Gender {
  Male = 'male',
  Female = 'female',
}

export const GenderMap: Record<Gender, string> = {
  [Gender.Male]: '男性',
  [Gender.Female]: '女性',
};
