import { Component, ElementRef, ViewChild } from '@angular/core';
import { ScenesService } from '../../services/scenes.service';
import { CommonModule } from '@angular/common';
import { Scene } from '../../../utils/types';
import { RulerService } from '../../services/ruler.service';
import { Subscription } from 'rxjs';

type VideoInfo = {
  videoIndex: number;
  currentTime: number;
};

@Component({
  selector: 'app-scene-collection-stack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scene-collection-stack.component.html',
  styleUrl: './scene-collection-stack.component.scss',
})
export class SceneCollectionStackComponent {
  constructor(
    private scenesService: ScenesService,
    private rulerService: RulerService
  ) {}

  @ViewChild('video1') video1!: ElementRef<HTMLVideoElement>;
  @ViewChild('video2') video2!: ElementRef<HTMLVideoElement>;

  private uploadedSceneSubscription: Subscription | undefined;
  private rulerSubscription: Subscription | undefined;

  public currentVideoRef!: HTMLVideoElement;
  public sceneToRender: Scene[] = [];
  public scene = '';

  ngOnInit() {
    this.uploadedSceneSubscription =
      this.scenesService.uploadedScene$.subscribe((scene) => {
        this.sceneToRender.push(scene);
      });

    this.rulerSubscription = this.rulerService.rulerStatus$.subscribe(
      (status) => {
        switch (status) {
          case 'CustomPosition':
          case 'Initial':
          case 'Replay':
          case 'Play':
            let customPosition = null;
            if (status === 'CustomPosition') {
              customPosition = this.rulerService.getCustomPosition();
            }

            const selectedUrlsToPlay = this.scenesService
              .getSelectedScenes()
              .map((scene) => scene);

            const firstVideo = this.video1.nativeElement;
            const secondVideo = this.video2.nativeElement;

            this.playVideosSubsequently(
              selectedUrlsToPlay,
              firstVideo,
              secondVideo,
              0,
              customPosition
            );
            break;
          case 'Pause':
            this.currentVideoRef.pause();
            break;
          case 'Resume':
            this.currentVideoRef.play();
            break;
          case 'Finished':
            console.log('finished');
            break;
          case 'SingleVideo':
            console.log('pre', this.scenesService.getSelectedScenes());

            const video = this.scenesService
              .getSelectedScenes()
              .map((scene) => scene.url);

            this.playSingleVideo(video[0], this.video1.nativeElement);
            break;
          default:
            break;
        }
      }
    );
  }

  private playSingleVideo(urls: string, video1: HTMLVideoElement) {
    if (video1) {
      video1.style.zIndex = '1';
      video1.src = urls;
      video1.play();
    }
  }

  private playVideosSubsequently(
    urls: Scene[],
    video1: HTMLVideoElement,
    video2: HTMLVideoElement,
    index: number,
    customPosition: number | null = null
  ) {
    if (customPosition) {
      const customInfo = this.getVideoInfoForCustomPosition(
        urls,
        customPosition
      );
      if (customInfo.videoIndex !== -1 && customInfo.currentTime !== -1) {
        index = customInfo.videoIndex !== -1 ? customInfo.videoIndex : index;
        customPosition =
          customInfo.currentTime !== -1
            ? customInfo.currentTime
            : customPosition;
      } else {
        console.error('Invalid custom position:', customPosition);
        return;
      }
    }

    if (index < 0 || index >= urls.length) {
      console.error('Invalid index:', index);
      return;
    }

    if (!video1 || !video2) {
      console.error('Both video elements must be provided');
      return;
    }

    this.currentVideoRef = video1;
    this.currentVideoRef.style.zIndex = '1';
    this.currentVideoRef.src = urls[index].url;
    if (customPosition !== null) {
      this.currentVideoRef.currentTime = customPosition;
    }

    this.currentVideoRef.play();
    this.currentVideoRef.onended = () => {
      index++;
      if (index < urls.length) {
        const nextVideo = this.currentVideoRef === video1 ? video2 : video1;
        nextVideo.src = urls[index].url;
        nextVideo.style.zIndex = '-1';
        nextVideo.play();
        this.playVideosSubsequently(urls, video1, video2, index);
      } else {
        console.log('All videos played.');
      }
    };
  }

  private getVideoInfoForCustomPosition(
    urls: Scene[],
    customPosition: number | null
  ): VideoInfo {
    if (
      customPosition !== null &&
      (customPosition < 0 ||
        customPosition >=
          urls.reduce(
            (totalDuration, scene) => totalDuration + scene.duration,
            0
          ))
    ) {
      console.error('Invalid custom position:', customPosition);
      return { videoIndex: -1, currentTime: -1 };
    }

    let remainingPosition = customPosition !== null ? customPosition : 0;
    let index = 0;
    let currentTime = 0;
    for (let i = 0; i < urls.length; i++) {
      const scene = urls[i];
      remainingPosition -= scene.duration;
      if (remainingPosition <= 0) {
        index = i;
        currentTime = scene.duration + remainingPosition;
        break;
      }
    }

    return { videoIndex: index, currentTime: currentTime };
  }

  ngOnDestroy() {
    if (this.uploadedSceneSubscription)
      this.uploadedSceneSubscription.unsubscribe();
    if (this.rulerSubscription) this.rulerSubscription.unsubscribe();
  }
}
