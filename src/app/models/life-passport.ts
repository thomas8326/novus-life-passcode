export interface LifePassportTable {
  [key: number]: Record<LifePassportKey, string>;
}

export interface LifePassport {
  innateNumbers: number[];
  acquiredNumbers: number[];
  mainNumber: number;
}

export enum LifePassportKey {
  方形三角圓圈,
  方形三角,
  方形圓圈,
  方形,
  三角,
  圓圈多,
  圓圈少,
  圓圈,
  無數字,
}
