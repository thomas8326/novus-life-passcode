import { Injectable } from '@angular/core';
import { LIFE_PASSPORT_TABLE } from 'src/app/consts/life-passport';
import { LifePassport, LifePassportKey } from 'src/app/models/life-passport';

@Injectable({
  providedIn: 'root',
})
export class LifePassportService {
  constructor() {}

  analyzeLifePasscode(birthday: string) {
    const passport = this.calculateNumbers(birthday);
    return this.getReview(passport);
  }

  analyzeID(Id: string) {
    if (Id.length !== 9) {
      throw new Error('Id is not correct.');
    }

    // 123084417
    let idStart = 0;
    let ageIndex = 0;
    const result: Record<number, string[]> = {};
    const idAry = Id.split('');
    const ageAry = [15, 20, 25, 30, 35, 40, 45, 50];
    const ageTemp = [ageAry[ageIndex]];

    while (idStart < idAry.length) {
      let idEnd = idStart + 1;
      let type = '';

      while (idAry[idEnd] === '5' || idAry[idEnd] === '0') {
        type = type === 'link' || idAry[idEnd] === '5' ? 'link' : 'copy';
        type = idEnd === idAry.length - 1 ? 'copy' : type;
        ageTemp.push(ageAry[++ageIndex]);
        idEnd = idEnd + 1;
      }

      while (ageTemp.length > 0) {
        const age = ageTemp.shift();

        if (!age) {
          return result;
        }

        result[age] = [];

        switch (type) {
          case 'copy':
            idAry[idStart] &&
              result[age].push(`${idAry[idStart]}${idAry[idStart]}`);
            idAry[idEnd] && result[age].push(`${idAry[idEnd]}${idAry[idEnd]}`);
            break;
          default:
            idAry[idStart] &&
              idAry[idEnd] &&
              result[age].push(`${idAry[idStart]}${idAry[idEnd]}`);
        }
      }
      idStart = idEnd;
      ageTemp.push(ageAry[++ageIndex]);
    }
    return result;
  }

  calculateNumbers(birthday: string): LifePassport {
    const dateInts = birthday
      .split('')
      .filter((value) => !['/', '-'].includes(value))
      .map((value) => parseInt(value, 10));

    const result = this.getAcquiredAndMain(dateInts);

    return {
      innateNumbers: dateInts,
      acquiredNumbers: result.acquired,
      mainNumber: result.main,
    };
  }

  getReview(lifePassport: LifePassport) {
    const { innateNumbers, acquiredNumbers, mainNumber } = lifePassport;
    const allNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    const innateMap = new Map<number, number>();
    innateNumbers.forEach((number) => {
      const count = innateMap.get(number);
      innateMap.set(number, count ? count + 1 : 1);
    });

    const acquiredMap = new Map<number, number>();
    acquiredNumbers.forEach((number) => {
      const count = acquiredMap.get(number);
      acquiredMap.set(number, count ? count + 1 : 1);
    });

    const resultMap = new Map<number, string>();
    const tableKeyMap = new Map<number, LifePassportKey>();

    const getTableKey = (currentNum: number) => {
      if (currentNum === mainNumber) {
        if (innateMap.has(currentNum) && acquiredMap.has(currentNum)) {
          return LifePassportKey.方形三角圓圈;
        }

        if (acquiredMap.has(currentNum)) {
          return LifePassportKey.方形三角;
        }

        if (innateMap.has(currentNum)) {
          return LifePassportKey.方形圓圈;
        }

        return LifePassportKey.方形;
      }

      if (acquiredMap.has(currentNum)) {
        return LifePassportKey.三角;
      }

      if (innateMap.has(currentNum)) {
        if ([0, 1, 4, 8, 9].includes(currentNum)) {
          return innateMap.get(currentNum)! > 2
            ? LifePassportKey.圓圈多
            : LifePassportKey.圓圈少;
        }

        return LifePassportKey.圓圈;
      }

      return LifePassportKey.無數字;
    };

    allNumbers.forEach((currentNum) => {
      const key = getTableKey(currentNum);
      tableKeyMap.set(currentNum, key);
      resultMap.set(currentNum, LIFE_PASSPORT_TABLE[currentNum][key]);
    });

    return { tableKeyMap, resultMap };
  }

  private getAcquiredAndMain(inputAry: number[]) {
    const sum: number = inputAry.reduce((acc, current) => acc + current, 0);

    if (sum < 10) {
      return { acquired: [0, sum], main: 0 + sum };
    }

    const first = this.getTensAndOnes(sum);

    if (first[0] + first[1] >= 10) {
      const second = this.getTensAndOnes(first[0] + first[1]);

      return { acquired: [...first, ...second], main: second[0] + second[1] };
    }
    return { acquired: first, main: first[0] + first[1] };
  }

  private getTensAndOnes(sum: number) {
    const tens = Math.floor(sum / 10);
    const ones = sum % 10;

    return [tens, ones];
  }
}
