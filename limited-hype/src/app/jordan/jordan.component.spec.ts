import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JordanComponent } from './jordan.component';

describe('JordanComponent', () => {
  let component: JordanComponent;
  let fixture: ComponentFixture<JordanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JordanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JordanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
