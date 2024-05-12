import { Component } from '@angular/core';
import { RulerComponent } from '../../components/ruler/ruler.component';
import { SceneSelectorComponent } from '../../components/scene-selector/scene-selector.component';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-video-edit-page',
  standalone: true,
  imports: [RulerComponent, SceneSelectorComponent, CdkDropListGroup],
  templateUrl: './video-edit-page.component.html',
  styleUrl: './video-edit-page.component.scss',
})
export class VideoEditPageComponent {}
