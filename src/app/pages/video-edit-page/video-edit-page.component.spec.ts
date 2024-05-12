import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEditPageComponent } from './video-edit-page.component';

describe('VideoEditPageComponent', () => {
  let component: VideoEditPageComponent;
  let fixture: ComponentFixture<VideoEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoEditPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
