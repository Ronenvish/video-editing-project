import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneCollectionStackComponent } from './scene-collection-stack.component';

describe('SceneCollectionStackComponent', () => {
  let component: SceneCollectionStackComponent;
  let fixture: ComponentFixture<SceneCollectionStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SceneCollectionStackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SceneCollectionStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
