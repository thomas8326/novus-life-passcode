import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDetailUserReviewComponent } from './dashboard-detail-user-review.component';

describe('DashboardDetailUserReviewComponent', () => {
  let component: DashboardDetailUserReviewComponent;
  let fixture: ComponentFixture<DashboardDetailUserReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardDetailUserReviewComponent]
    });
    fixture = TestBed.createComponent(DashboardDetailUserReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
