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

export enum IDKey {
  財富智慧 = '財富智慧',
  生命力 = '生命力',
  貴人 = '貴人',
  平平待待 = '平平待待',
  禍害 = '禍害',
  六煞 = '六煞',
  絕命 = '絕命',
  五鬼 = '五鬼',
}
