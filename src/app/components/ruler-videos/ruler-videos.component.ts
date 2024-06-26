import { Component, Input, SimpleChanges } from '@angular/core';
import { Scene } from '../../../utils/types';
import { ScenesService } from '../../services/scenes.service';

@Component({
  selector: 'app-ruler-videos',
  standalone: true,
  imports: [],
  templateUrl: './ruler-videos.component.html',
  styleUrl: './ruler-videos.component.scss',
})
export class RulerVideosComponent {
  constructor(private scenesService: ScenesService) {}
  @Input() public scene!: Scene;
  @Input() public width!: number;

  public calculatedWidth: number | undefined;

  ngOnInit() {
    this.scenesService.changeSceneStatus(this.scene.id, true);
    this.calculatedWidth = this.width && this.width * this.scene.duration;
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('width' in changes) {
      this.calculatedWidth =
        changes['width'].currentValue * this.scene.duration;
    }
  }
}
