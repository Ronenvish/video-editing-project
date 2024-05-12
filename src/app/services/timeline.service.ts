import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { Scene } from '../../utils/types';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  constructor() {}

  private uploadedScenes: Scene[] = [];
  private _uploadedScene$ = new Subject<Scene>();
  public uploadedScene$ = this._uploadedScene$.asObservable();

  private scenesToRender: Scene[] = [];
  private _scenesToRender$ = new Subject<Scene>();
  public scenesToRender$ = this._scenesToRender$.asObservable();

  public addOneSceneToRender(scene: Scene) {
    this.scenesToRender.push(scene);
    this._scenesToRender$.next(scene);
  }

  public addOneSceneToUpload(scene: Scene) {
    this.uploadedScenes.push(scene);
    this._uploadedScene$.next(scene);
  }

  addSelectedScenesByArrayOfIds(SceneId: string[]) {
    this.scenesToRender = this.uploadedScenes
      .filter((scene) => SceneId.includes(scene.id))
      .sort((scene1, scene2) => {
        const index1 = SceneId.indexOf(scene1.id);
        const index2 = SceneId.indexOf(scene2.id);
        return index1 - index2;
      });
  }

  getSelectedScenes() {
    return this.scenesToRender;
  }

  changeSceneStatus(id: string, status: boolean) {
    const scene = this.uploadedScenes.find((scene) => scene.id === id);
    if (scene) {
      scene.selected = status;
    }
  }
}
