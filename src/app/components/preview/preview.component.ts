import { Component } from '@angular/core';
import { SceneCollectionStackComponent } from '../scene-collection-stack/scene-collection-stack.component';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [SceneCollectionStackComponent],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
})
export class PreviewComponent {}
