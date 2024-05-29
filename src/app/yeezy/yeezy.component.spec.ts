import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YeezyComponent } from './yeezy.component';

describe('YeezyComponent', () => {
  let component: YeezyComponent;
  let fixture: ComponentFixture<YeezyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YeezyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YeezyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
