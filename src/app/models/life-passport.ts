export interface LifePassportTable {
  [key: string]: Partial<Record<LifePassportKey, string>>;
}

export interface LifePassport {
  innateNumbers: number[];
  acquiredNumbers: number[];
  mainNumber: number;
}

export enum LifePassportKey {
  方形三角圓圈 = 'square_triangle_circle',
  方形三角 = 'square_triangle',
  方形圓圈 = 'square_circle',
  方形 = 'square',
  三角 = 'triangle',
  圓圈多 = 'circle_many',
  圓圈少 = 'circle_few',
  圓圈 = 'circle',
  無數字 = 'no_number',
  有連線 = 'has_line',
  無連線 = 'no_line',
}

export enum IDKey {
  財富智慧 = 'wealth_and_wisdom',
  生命力 = 'vitality',
  貴人 = 'noble_people',
  平平等待 = 'waiting',
  禍害 = 'calamity',
  六煞 = 'six_evils',
  絕命 = 'fatal',
  五鬼 = 'five_ghosts',
}
