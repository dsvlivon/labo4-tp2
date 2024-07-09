import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiPerfil2Component } from './mi-perfil2.component';

describe('MiPerfil2Component', () => {
  let component: MiPerfil2Component;
  let fixture: ComponentFixture<MiPerfil2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiPerfil2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiPerfil2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
