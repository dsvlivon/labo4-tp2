import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabilitarUsuariosComponent } from './habilitar-usuarios.component';

describe('HabilitarUsuariosComponent', () => {
  let component: HabilitarUsuariosComponent;
  let fixture: ComponentFixture<HabilitarUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabilitarUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabilitarUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
