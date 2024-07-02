import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartelinComponent } from './cartelin.component';

describe('CartelinComponent', () => {
  let component: CartelinComponent;
  let fixture: ComponentFixture<CartelinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartelinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartelinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
