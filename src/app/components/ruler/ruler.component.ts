import { Component, ElementRef } from '@angular/core';
import { CursorComponent } from '../cursor/cursor.component';
import {
  CdkDropList,
  CdkDrag,
  CdkDropListGroup,
  CdkDragDrop,
} from '@angular/cdk/drag-drop';
import { Scene, RulerStatus } from '../../../utils/types';
import { DragNDropService } from '../../services/drag-n-drop.service';
import { SceneComponent } from '../scene/scene.component';
import { CommonModule } from '@angular/common';
import { ScenesService } from '../../services/scenes.service';
import { RulerVideosComponent } from '../ruler-videos/ruler-videos.component';
import { ButtonModule } from 'primeng/button';
import { RulerService } from '../../services/ruler.service';

@Component({
  selector: 'app-ruler',
  standalone: true,
  imports: [
    CommonModule,
    CursorComponent,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    SceneComponent,
    RulerVideosComponent,
    ButtonModule,
  ],
  templateUrl: './ruler.component.html',
  styleUrl: './ruler.component.scss',
})
export class RulerComponent {
  constructor(
    private dragNDropService: DragNDropService,
    private scenesService: ScenesService,
    private rulerService: RulerService,
    private elementRef: ElementRef
  ) {}

  public selectedSceneInsideRuler: Scene[] = [];
  public label: RulerStatus = 'Play';
  public initialLeftPosition: number = 0;
  public minTimelineLength = 15;
  public currentTimelineLength = 15;
  public timeFrame = 0;

  public animationFrameId: number | null = null;
  public animationStartTime: number | null = null;
  public currentPosition: number = 0;
  public containerWidth: number = 0;
  public isPaused: boolean = false;

  getCurrentScenesLength() {
    return this.selectedSceneInsideRuler.reduce(
      (acc, scene) => acc + scene.duration,
      0
    );
  }

  drop(event: CdkDragDrop<Scene[]>) {
    const eventData = event.item.data;
    if (eventData) {
      if (
        this.getCurrentScenesLength() + eventData.duration >
        this.currentTimelineLength
      ) {
        if (this.getCurrentScenesLength() === 0)
          this.zoomIn(eventData.duration - this.currentTimelineLength);
        else
          this.zoomIn(
            eventData.duration -
              this.currentTimelineLength +
              this.getCurrentScenesLength()
          );
      }
    }
    this.dragNDropService.drop(event);
  }

  onDragEnded(event: any) {
    this.currentPosition = Math.abs(event.source.getFreeDragPosition().x);
  }

  zoomIn(num: number = 1) {
    this.currentTimelineLength += num;
  }

  zoomOut(num: number = 1) {
    if (this.currentTimelineLength > this.minTimelineLength) {
      this.currentTimelineLength -= num;
    }
  }

  calculateChildrenWidth() {
    const container =
      this.elementRef.nativeElement.querySelector('.ruler-scene');
    const rulerWidth = container.offsetWidth;
    const childWidth = rulerWidth / this.currentTimelineLength - 2;
    return Math.round(childWidth);
  }

  setRulerToSelectedNumberOnClick(timeFrame: number) {
    this.timeFrame = timeFrame;
    const container =
      this.elementRef.nativeElement.querySelector('.ruler-time');
    const rulerWidth = container.offsetWidth;
    this.currentPosition =
      (timeFrame * rulerWidth) / this.currentTimelineLength;
  }

  generateRange() {
    return Array(this.currentTimelineLength)
      .fill(0)
      .map((x, i) => i);
  }

  calculateCurrentPosition() {
    const container =
      this.elementRef.nativeElement.querySelector('.ruler-time');
    const rulerWidth = container.offsetWidth;
    return (this.currentPosition * this.currentTimelineLength) / rulerWidth;
  }

  buttonToggleClick() {
    if (this.selectedSceneInsideRuler.length === 0) {
      return;
    }

    const status = this.rulerService.getRulerStatus();
    const container =
      this.elementRef.nativeElement.querySelector('.listed-scenes');
    this.containerWidth = container.offsetWidth;

    switch (status) {
      case 'Initial':
      case 'SingleVideo':
      case 'Finished':
        this.label = 'Pause';
        if (this.currentPosition !== 0) {
          const customPosition =
            this.timeFrame !== 0
              ? this.timeFrame
              : this.calculateCurrentPosition();
          this.scenesService.addSelectedScenesByArrayOfIds(
            this.selectedSceneInsideRuler.map((scene) => scene.id)
          );
          this.rulerService.setCustomPosition(customPosition);
          this.rulerService.setRulerStatus('CustomPosition');
          this.startAnimation();
        } else {
          this.scenesService.addSelectedScenesByArrayOfIds(
            this.selectedSceneInsideRuler.map((scene) => scene.id)
          );
          this.rulerService.setRulerStatus('Play');
          this.startAnimation();
        }
        break;
      case 'Play':
        this.label = 'Pause';
        this.pauseAnimation();
        this.rulerService.setRulerStatus('Pause');
        break;
      case 'Pause':
        this.label = 'Resume';
        this.rulerService.setRulerStatus('Resume');
        this.startAnimation();
        break;
      case 'Resume':
        this.label = 'Pause';
        this.pauseAnimation();
        this.rulerService.setRulerStatus('Pause');
        break;
      default:
        break;
    }
  }

  startAnimation() {
    if (this.isPaused) {
      this.isPaused = false;
      this.animationStartTime = performance.now();
      this.animate();
    } else {
      this.animationStartTime = performance.now();
      this.animate();
    }
  }

  pauseAnimation() {
    cancelAnimationFrame(this.animationFrameId!);
    this.isPaused = true;
  }

  updatePosition(timestamp: number, startingPosition: number = 0) {
    if (!this.animationStartTime) {
      this.animationStartTime = timestamp;
    }

    const elapsedTime = timestamp - this.animationStartTime;
    // Calculate the end position based on the container width
    const endPosition = this.containerWidth;
    if (
      elapsedTime >= this.getCurrentScenesLength() * 1000 ||
      this.currentPosition >= endPosition
    ) {
      // Stop the animation when the duration is reached or the end position is reached
      this.currentPosition = 0; // Set position to end position
      this.animationStartTime = null;
      this.label = 'Replay';
      this.rulerService.setRulerStatus('Finished');
    } else {
      // Calculate the new position based on elapsed time
      this.currentPosition =
        startingPosition +
        (elapsedTime / (this.getCurrentScenesLength() * 1000)) * endPosition;
    }

    // Request the next animation frame if animation is still ongoing and not paused
    if (this.animationStartTime !== null && !this.isPaused) {
      this.animationFrameId = requestAnimationFrame((timestamp) =>
        this.updatePosition(timestamp, startingPosition)
      );
    }
  }

  animate() {
    this.animationFrameId = requestAnimationFrame((timestamp) =>
      this.updatePosition(timestamp, this.currentPosition)
    );
  }

  ngOnDestroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
