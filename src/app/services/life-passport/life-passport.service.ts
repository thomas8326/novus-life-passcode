import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LifePassportService {
  constructor() {}

  calculate(isoDate: string) {
    const birthday = new Date(isoDate);
    const dateInts = birthday
      .toISOString()
      .split('T')[0]
      .split('')
      .filter((value) => value !== '-')
      .map((value) => parseInt(value, 10));

    const result = this.getAcquiredAndMain(dateInts);

    return {
      innateNumbers: dateInts.map((value) => value.toString()),
      acquiredNumbers: result.acquired.map((value) => value.toString()),
      mainNumber: result.main,
    };
  }

  private getAcquiredAndMain(inputAry: number[]) {
    const sum: number = inputAry.reduce((acc, current) => acc + current, 0);

    if (sum < 10) {
      return { acquired: [0, sum], main: 0 + sum };
    }

    const first = this.getTensAndOnes(sum);

    if (first[0] + first[1] > 10) {
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
