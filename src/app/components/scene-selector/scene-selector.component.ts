import { Component } from '@angular/core';
import { ScenesComponent } from '../scenes/scenes.component';
import { PreviewComponent } from '../preview/preview.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scene-selector',
  standalone: true,
  imports: [ScenesComponent, PreviewComponent, CommonModule],
  templateUrl: './scene-selector.component.html',
  styleUrl: './scene-selector.component.scss',
})
export class SceneSelectorComponent {}
