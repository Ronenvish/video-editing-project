import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneSelectorComponent } from './scene-selector.component';

describe('SceneSelectorComponent', () => {
  let component: SceneSelectorComponent;
  let fixture: ComponentFixture<SceneSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SceneSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SceneSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
