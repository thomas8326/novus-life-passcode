import { TestBed } from '@angular/core/testing';

import { LifePassport, LifePassportKey } from 'src/app/models/life-passport';
import { LifePassportService } from './life-passport.service';

const ALL_NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

describe('LifePassportService', () => {
  let service: LifePassportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LifePassportService],
    });
    service = TestBed.inject(LifePassportService);
  });

  it('Should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('with 1994/11/26', () => {
    let result: LifePassport;
    let keyMap: Map<number, LifePassportKey>;

    beforeEach(() => {
      const birthdayISO = new Date('1994-11-26').toISOString();
      result = service.calculate(birthdayISO);
      keyMap = service.getReview(result).tableKeyMap;
    });

    it('the innate, acquire, main number should be correct.', () => {
      expect(result.innateNumbers).toEqual([1, 9, 9, 4, 1, 1, 2, 6]);
      expect(result.acquiredNumbers).toEqual([3, 3]);
      expect(result.mainNumber).toEqual(6);
    });

    const expectedResult = [
      LifePassportKey.無數字,
      LifePassportKey.圓圈多,
      LifePassportKey.圓圈,
      LifePassportKey.三角,
      LifePassportKey.圓圈少,
      LifePassportKey.無數字,
      LifePassportKey.方形圓圈,
      LifePassportKey.無數字,
      LifePassportKey.無數字,
      LifePassportKey.圓圈少,
    ];

    ALL_NUMBERS.forEach((number, index) => {
      it(`result of review should be correct: number ${number}`, () => {
        expect(keyMap.get(number)).toEqual(expectedResult[index]);
      });
    });
  });

  describe('with 1994/11/19', () => {
    let result: LifePassport;
    let keyMap: Map<number, LifePassportKey>;

    beforeEach(() => {
      const birthdayISO = new Date('1994-11-19').toISOString();
      result = service.calculate(birthdayISO);
      keyMap = service.getReview(result).tableKeyMap;
    });

    it('the innate, acquire, main number should be correct.', () => {
      expect(result.innateNumbers).toEqual([1, 9, 9, 4, 1, 1, 1, 9]);
      expect(result.acquiredNumbers).toEqual([3, 5]);
      expect(result.mainNumber).toEqual(8);
    });

    const expectedResult = [
      LifePassportKey.無數字,
      LifePassportKey.圓圈多,
      LifePassportKey.無數字,
      LifePassportKey.三角,
      LifePassportKey.圓圈少,
      LifePassportKey.三角,
      LifePassportKey.無數字,
      LifePassportKey.無數字,
      LifePassportKey.方形,
      LifePassportKey.圓圈多,
    ];

    ALL_NUMBERS.forEach((number, index) => {
      it(`result of review should be correct: number ${number}`, () => {
        expect(keyMap.get(number)).toEqual(expectedResult[index]);
      });
    });
  });

  describe('with 2000/10/20', () => {
    let result: LifePassport;
    let keyMap: Map<number, LifePassportKey>;

    beforeEach(() => {
      const birthdayISO = new Date('2000-10-20').toISOString();
      result = service.calculate(birthdayISO);
      keyMap = service.getReview(result).tableKeyMap;
    });

    it('the innate, acquire, main number should be correct.', () => {
      expect(result.innateNumbers).toEqual([2, 0, 0, 0, 1, 0, 2, 0]);
      expect(result.acquiredNumbers).toEqual([0, 5]);
      expect(result.mainNumber).toEqual(5);
    });

    const expectedResult = [
      LifePassportKey.三角,
      LifePassportKey.圓圈少,
      LifePassportKey.圓圈,
      LifePassportKey.無數字,
      LifePassportKey.無數字,
      LifePassportKey.方形三角,
      LifePassportKey.無數字,
      LifePassportKey.無數字,
      LifePassportKey.無數字,
      LifePassportKey.無數字,
    ];

    ALL_NUMBERS.forEach((number, index) => {
      it(`result of review should be correct: number ${number}`, () => {
        expect(keyMap.get(number)).toEqual(expectedResult[index]);
      });
    });
  });

  describe('with 1991/02/07 ', () => {
    let result: LifePassport;
    let keyMap: Map<number, LifePassportKey>;

    beforeEach(() => {
      const birthdayISO = new Date('1991-02-07').toISOString();
      result = service.calculate(birthdayISO);
      keyMap = service.getReview(result).tableKeyMap;
    });

    it('the innate, acquire, main number should be correct.', () => {
      expect(result.innateNumbers).toEqual([1, 9, 9, 1, 0, 2, 0, 7]);
      expect(result.acquiredNumbers).toEqual([2, 9, 1, 1]);
      expect(result.mainNumber).toEqual(2);
    });

    const expectedResult = [
      LifePassportKey.圓圈少,
      LifePassportKey.三角,
      LifePassportKey.方形三角圓圈,
      LifePassportKey.無數字,
      LifePassportKey.無數字,
      LifePassportKey.無數字,
      LifePassportKey.無數字,
      LifePassportKey.圓圈,
      LifePassportKey.無數字,
      LifePassportKey.三角,
    ];

    ALL_NUMBERS.forEach((number, index) => {
      it(`result of review should be correct: number ${number}`, () => {
        expect(keyMap.get(number)).toEqual(expectedResult[index]);
      });
    });
  });
});
