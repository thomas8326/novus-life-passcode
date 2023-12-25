import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrystalShowroom } from 'src/app/models/crystal';

@Injectable({
  providedIn: 'root',
})
export class CrystalService {
  constructor(private http: HttpClient) {}

  getCrystalShowroom() {
    return this.http.get<CrystalShowroom>('/assets/mock/crystals.json');
  }
}
