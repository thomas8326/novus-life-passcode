import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Crystal } from 'src/app/models/crystal';

@Injectable({
  providedIn: 'root',
})
export class CrystalService {
  constructor(private http: HttpClient) {}

  getCrystals() {
    return this.http.get<Crystal[]>('/assets/mock/crystals.json');
  }
}
