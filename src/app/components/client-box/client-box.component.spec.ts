import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBoxComponent } from './client-box.component';

describe('ClientBoxComponent', () => {
  let component: ClientBoxComponent;
  let fixture: ComponentFixture<ClientBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
