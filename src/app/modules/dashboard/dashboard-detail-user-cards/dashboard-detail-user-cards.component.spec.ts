import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDetailUserCardsComponent } from './dashboard-detail-user-cards.component';

describe('DashboardDetailUserCardsComponent', () => {
  let component: DashboardDetailUserCardsComponent;
  let fixture: ComponentFixture<DashboardDetailUserCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardDetailUserCardsComponent]
    });
    fixture = TestBed.createComponent(DashboardDetailUserCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
