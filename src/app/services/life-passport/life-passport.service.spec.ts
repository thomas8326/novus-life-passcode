import { TestBed } from '@angular/core/testing';

import { LifePassportService } from './life-passport.service';

describe('LifePassportService', () => {
  let service: LifePassportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LifePassportService);
  });

  it('Should be created', () => {
    expect(service).toBeTruthy();
  });

  it('with 1994/11/26 the innate, acquire, main number should be correct.', () => {
    const birthdayISO = new Date('1994-11-26').toISOString();
    const result = service.calculate(birthdayISO);

    expect(result.innateNumbers).toEqual([
      '1',
      '9',
      '9',
      '4',
      '1',
      '1',
      '2',
      '6',
    ]);

    expect(result.acquiredNumbers).toEqual(['3', '3']);
    expect(result.mainNumber).toEqual(6);
  });

  it('with 1994/11/19 the innate, acquire, main number should be correct.', () => {
    const birthdayISO = new Date('1994-11-19').toISOString();
    const result = service.calculate(birthdayISO);

    expect(result.innateNumbers).toEqual([
      '1',
      '9',
      '9',
      '4',
      '1',
      '1',
      '1',
      '9',
    ]);

    expect(result.acquiredNumbers).toEqual(['3', '5']);
    expect(result.mainNumber).toEqual(8);
  });

  it('with 2000/10/20 the innate, acquire, main number should be correct.', () => {
    const birthdayISO = new Date('2000-10-20').toISOString();
    const result = service.calculate(birthdayISO);
    expect(result.innateNumbers).toEqual([
      '2',
      '0',
      '0',
      '0',
      '1',
      '0',
      '2',
      '0',
    ]);

    expect(result.acquiredNumbers).toEqual(['0', '5']);
    expect(result.mainNumber).toEqual(5);
  });
  it('with 1991/02/07 the innate, acquire, main number should be correct.', () => {
    const birthdayISO = new Date('1991-02-07').toISOString();
    const result = service.calculate(birthdayISO);
    expect(result.innateNumbers).toEqual([
      '1',
      '9',
      '9',
      '1',
      '0',
      '2',
      '0',
      '7',
    ]);

    expect(result.acquiredNumbers).toEqual(['2', '9', '1', '1']);
    expect(result.mainNumber).toEqual(2);
  });
});
