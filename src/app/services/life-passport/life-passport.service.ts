import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import {
  LifePassport,
  LifePassportKey,
  LifePassportReviewResult,
  LifePassportTextMap,
} from 'src/app/models/life-passport';
import { LifePassportDescriptionService } from 'src/app/services/life-passport/life-passport-description.service';

@Injectable({
  providedIn: 'root',
})
export class LifePassportService {
  constructor(
    private readonly lifePassportDescriptionService: LifePassportDescriptionService,
  ) {}

  analyzeLifePasscode(birthday: string) {
    const passport = this.calculateNumbers(birthday);
    const review = this.getReview(passport);
    return {
      passport,
      review,
    };
  }

  analyzeID(Id: string) {
    if (Id.length !== 9) {
      throw new Error('Id is not correct.');
    }

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
    const dateInts = dayjs(birthday)
      .format('YYYY/MM/DD')
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
    const allLines = [123, 147, 159, 1590, 258, 456, 3690];

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

    const results: LifePassportReviewResult[] = [];

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
      const lifePassportKey = getTableKey(currentNum);
      const descriptionKey = `number_${currentNum}`;
      const description =
        this.lifePassportDescriptionService.lifePassportAllTable[
          descriptionKey
        ][lifePassportKey] || '';

      results.push({
        number: currentNum,
        lifePassportKey: lifePassportKey,
        title: LifePassportTextMap[lifePassportKey],
        description,
      });
    });

    allLines.forEach((line) => {
      const split = line.toString().split('');
      console.log(split);
      const hasConnect = split.every(
        (num) =>
          acquiredMap.has(+num) || innateMap.has(+num) || mainNumber === +num,
      );
      this.lifePassportDescriptionService.lifePassportAllTable;

      let lifePassportKey = hasConnect
        ? LifePassportKey.有連線
        : LifePassportKey.無連線;

      const descriptionKey = `number_${line}`;
      const description =
        this.lifePassportDescriptionService.lifePassportAllTable[
          descriptionKey
        ][lifePassportKey] || '';
      results.push({
        number: line,
        lifePassportKey,
        title: LifePassportTextMap[lifePassportKey],
        description,
      });
    });

    return { results };
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
