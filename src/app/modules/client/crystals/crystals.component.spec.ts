import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrystalsComponent } from './crystals.component';

describe('CrystalsComponent', () => {
  let component: CrystalsComponent;
  let fixture: ComponentFixture<CrystalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrystalsComponent]
    });
    fixture = TestBed.createComponent(CrystalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
