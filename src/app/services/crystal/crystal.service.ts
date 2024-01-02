import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AllCrystalType } from 'src/app/models/crystal';
import { AllCrystalAccessoryType } from 'src/app/models/crystal-accessory';

@Injectable({
  providedIn: 'root',
})
export class CrystalService {
  constructor(private http: HttpClient) {}

  getCrystalShowroom() {
    return this.http.get<AllCrystalType>('/assets/mock/crystals.json');
  }

  getCrystalAccessories() {
    return this.http.get<AllCrystalAccessoryType>(
      '/assets/mock/crystal-accessories.json',
    );
  }
}
