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
      result = service.calculateNumbers(birthdayISO);
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
      result = service.calculateNumbers(birthdayISO);
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
      result = service.calculateNumbers(birthdayISO);
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
      result = service.calculateNumbers(birthdayISO);
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

  describe('analyze the id', () => {
    it('that id length is less then 9', () => {
      expect(() => service.analyzeID('12345678')).toThrowError(
        'Id is not correct.',
      );
    });
    it('that id length is more then 9', () => {
      expect(() => service.analyzeID('1234567890')).toThrowError(
        'Id is not correct.',
      );
    });
    it('that id is 123456789', () => {
      const expected = {
        15: ['12'],
        20: ['23'],
        25: ['34'],
        30: ['46'],
        35: ['46'],
        40: ['67'],
        45: ['78'],
        50: ['89'],
      };
      const actual = service.analyzeID('123456789');
      expect(actual).toEqual(expected);
    });
    it('that id is 224370170', () => {
      const expected = {
        15: ['22'],
        20: ['24'],
        25: ['43'],
        30: ['37'],
        35: ['77', '11'],
        40: ['77', '11'],
        45: ['17'],
        50: ['77'],
      };
      const actual = service.analyzeID('224370170');
      expect(actual).toEqual(expected);
    });
    it('that id is 226345393', () => {
      const expected = {
        15: ['22'],
        20: ['26'],
        25: ['63'],
        30: ['34'],
        35: ['43'],
        40: ['43'],
        45: ['39'],
        50: ['93'],
      };
      const actual = service.analyzeID('226345393');
      expect(actual).toEqual(expected);
    });
    it('that id is 229110510', () => {
      const expected = {
        15: ['22'],
        20: ['29'],
        25: ['91'],
        30: ['11'],
        35: ['11'],
        40: ['11'],
        45: ['11'],
        50: ['11'],
      };
      const actual = service.analyzeID('229110510');
      expect(actual).toEqual(expected);
    });
    it('that id is 224527354', () => {
      const expected = {
        15: ['22'],
        20: ['24'],
        25: ['42'],
        30: ['42'],
        35: ['27'],
        40: ['73'],
        45: ['34'],
        50: ['34'],
      };
      const actual = service.analyzeID('224527354');
      expect(actual).toEqual(expected);
    });
    it('that id is 223466905', () => {
      const expected = {
        15: ['22'],
        20: ['23'],
        25: ['34'],
        30: ['46'],
        35: ['66'],
        40: ['69'],
        45: ['99'],
        50: ['99'],
      };
      const actual = service.analyzeID('223466905');
      expect(actual).toEqual(expected);
    });
    it('that id is 225013838', () => {
      const expected = {
        15: ['22'],
        20: ['21'],
        25: ['21'],
        30: ['21'],
        35: ['13'],
        40: ['38'],
        45: ['83'],
        50: ['38'],
      };
      const actual = service.analyzeID('225013838');
      expect(actual).toEqual(expected);
    });
    it('that id is 224058275', () => {
      const expected = {
        15: ['22'],
        20: ['24'],
        25: ['48'],
        30: ['48'],
        35: ['48'],
        40: ['82'],
        45: ['27'],
        50: ['77'],
      };
      const actual = service.analyzeID('224058275');
      expect(actual).toEqual(expected);
    });
    it('that id is 222585075', () => {
      const expected = {
        15: ['22'],
        20: ['22'],
        25: ['28'],
        30: ['28'],
        35: ['87'],
        40: ['87'],
        45: ['87'],
        50: ['77'],
      };
      const actual = service.analyzeID('222585075');
      expect(actual).toEqual(expected);
    });
    it('that id is 228795760', () => {
      const expected = {
        15: ['22'],
        20: ['28'],
        25: ['87'],
        30: ['79'],
        35: ['97'],
        40: ['97'],
        45: ['76'],
        50: ['66'],
      };
      const actual = service.analyzeID('228795760');
      expect(actual).toEqual(expected);
    });
    it('that id is 221360300', () => {
      const expected = {
        15: ['22'],
        20: ['21'],
        25: ['13'],
        30: ['36'],
        35: ['66', '33'],
        40: ['66', '33'],
        45: ['33'],
        50: ['33'],
      };
      const actual = service.analyzeID('221360300');
      expect(actual).toEqual(expected);
    });
    it('that id is 224045508', () => {
      const expected = {
        15: ['22'],
        20: ['24'],
        25: ['44', '44'],
        30: ['44', '44'],
        35: ['48'],
        40: ['48'],
        45: ['48'],
        50: ['48'],
      };
      const actual = service.analyzeID('224045508');
      expect(actual).toEqual(expected);
    });
    it('that id is 224242426', () => {
      const expected = {
        15: ['22'],
        20: ['24'],
        25: ['42'],
        30: ['24'],
        35: ['42'],
        40: ['24'],
        45: ['42'],
        50: ['26'],
      };
      const actual = service.analyzeID('224242426');
      expect(actual).toEqual(expected);
    });
    it('that id is 228980004', () => {
      const expected = {
        15: ['22'],
        20: ['28'],
        25: ['89'],
        30: ['98'],
        35: ['88', '44'],
        40: ['88', '44'],
        45: ['88', '44'],
        50: ['88', '44'],
      };
      const actual = service.analyzeID('228980004');
      expect(actual).toEqual(expected);
    });
    it('that id is 221451703', () => {
      const expected = {
        15: ['22'],
        20: ['21'],
        25: ['14'],
        30: ['41'],
        35: ['41'],
        40: ['17'],
        45: ['77', '33'],
        50: ['77', '33'],
      };
      const actual = service.analyzeID('221451703');
      expect(actual).toEqual(expected);
    });
    it('that id is 230221613', () => {
      const expected = {
        15: ['23'],
        20: ['33', '22'],
        25: ['33', '22'],
        30: ['22'],
        35: ['21'],
        40: ['16'],
        45: ['61'],
        50: ['13'],
      };
      const actual = service.analyzeID('230221613');
      expect(actual).toEqual(expected);
    });
    it('that id is 228226555', () => {
      const expected = {
        15: ['22'],
        20: ['28'],
        25: ['82'],
        30: ['22'],
        35: ['26'],
        40: ['66'],
        45: ['66'],
        50: ['66'],
      };
      const actual = service.analyzeID('228226555');
      expect(actual).toEqual(expected);
    });
    it('that id is 121445599', () => {
      const expected = {
        15: ['12'],
        20: ['21'],
        25: ['14'],
        30: ['44'],
        35: ['49'],
        40: ['49'],
        45: ['49'],
        50: ['99'],
      };
      const actual = service.analyzeID('121445599');
      expect(actual).toEqual(expected);
    });
    it('that id is 224540232', () => {
      const expected = {
        15: ['22'],
        20: ['24'],
        25: ['44'],
        30: ['44'],
        35: ['44', '22'],
        40: ['44', '22'],
        45: ['23'],
        50: ['32'],
      };
      const actual = service.analyzeID('224540232');
      expect(actual).toEqual(expected);
    });
    it('that id is 223409505', () => {
      const expected = {
        15: ['22'],
        20: ['23'],
        25: ['34'],
        30: ['44', '99'],
        35: ['44', '99'],
        40: ['99'],
        45: ['99'],
        50: ['99'],
      };
      const actual = service.analyzeID('223409505');
      expect(actual).toEqual(expected);
    });
    it('that id is 222727548', () => {
      const expected = {
        15: ['22'],
        20: ['22'],
        25: ['27'],
        30: ['72'],
        35: ['27'],
        40: ['74'],
        45: ['74'],
        50: ['48'],
      };
      const actual = service.analyzeID('222727548');
      expect(actual).toEqual(expected);
    });
    it('that id is 226685658', () => {
      const expected = {
        15: ['22'],
        20: ['26'],
        25: ['66'],
        30: ['68'],
        35: ['86'],
        40: ['86'],
        45: ['68'],
        50: ['68'],
      };
      const actual = service.analyzeID('226685658');
      expect(actual).toEqual(expected);
    });
  });
});
