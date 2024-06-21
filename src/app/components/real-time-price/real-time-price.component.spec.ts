import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimePriceComponent } from './real-time-price.component';

describe('RealTimePriceComponent', () => {
  let component: RealTimePriceComponent;
  let fixture: ComponentFixture<RealTimePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealTimePriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealTimePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
