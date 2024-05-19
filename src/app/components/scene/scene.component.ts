import { Component, Input } from '@angular/core';
import { Scene } from '../../../utils/types';
import { PlayButtonComponent } from '../play-button/play-button.component';
import { ScenesService } from '../../services/scenes.service';
import { RulerService } from '../../services/ruler.service';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [PlayButtonComponent],
  templateUrl: './scene.component.html',
  styleUrl: './scene.component.scss',
})
export class SceneComponent {
  constructor(
    private scenesService: ScenesService,
    private rulerService: RulerService
  ) {}

  @Input() public scene!: Scene;

  playScene() {
    this.scenesService.addSelectedScenesByArrayOfIds([this.scene.id]);
    this.rulerService.setRulerStatus('SingleVideo');
  }
}
