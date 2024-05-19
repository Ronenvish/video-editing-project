import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SceneComponent } from '../scene/scene.component';
import { CommonModule } from '@angular/common';
import { Scene } from '../../../utils/types';
import { FileUploadModule } from 'primeng/fileupload';
import { ScenesService } from '../../services/scenes.service';
import {
  CdkDropList,
  CdkDrag,
  CdkDropListGroup,
  CdkDragDrop,
} from '@angular/cdk/drag-drop';
import { DragNDropService } from '../../services/drag-n-drop.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-scenes',
  standalone: true,
  imports: [
    SceneComponent,
    CommonModule,
    FileUploadModule,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
  ],
  templateUrl: './scenes.component.html',
  styleUrl: './scenes.component.scss',
})
export class ScenesComponent {
  constructor(
    private scenesService: ScenesService,
    private dragNDropService: DragNDropService
  ) {}

  @ViewChild('uploaded') videoElement!: ElementRef<HTMLVideoElement>;

  private uploadedSceneSubscription: Subscription | undefined;

  public loadedMetadataListener: any;
  public scenesToRender: Scene[] = [];
  public src = '';

  drop(event: CdkDragDrop<Scene[]>) {
    this.dragNDropService.drop(event);
  }

  onUpload(event: any) {
    for (const file of event.files) {
      console.log(file);
      this.src = URL.createObjectURL(file);
      this.loadedMetadataListener = () => {
        const newScene: Scene = {
          id: crypto.randomUUID(),
          name: file.name,
          duration: Math.round(this.videoElement.nativeElement.duration),
          url: this.src,
          selected: false,
        };

        this.scenesService.addOneSceneToUpload(newScene);
        this.videoElement.nativeElement.removeEventListener(
          'loadedmetadata',
          this.loadedMetadataListener
        );
      };

      this.videoElement.nativeElement.addEventListener(
        'loadedmetadata',
        this.loadedMetadataListener
      );
    }
  }

  onMetadataLoaded(fileName: string, url: string) {
    const newScene: Scene = {
      id: crypto.randomUUID(),
      name: fileName,
      duration: this.videoElement.nativeElement.duration,
      url: url,
      selected: false,
    };

    this.scenesService.addOneSceneToUpload(newScene);
  }

  ngOnInit() {
    this.uploadedSceneSubscription =
      this.scenesService.uploadedScene$.subscribe((scene) => {
        this.scenesToRender.push(scene!);
      });
  }

  ngOnDestroy() {
    if (this.uploadedSceneSubscription)
      this.uploadedSceneSubscription.unsubscribe();
  }
}
