import { Injectable } from '@angular/core';
import { RulerStatus } from '../../utils/types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RulerService {
  constructor() {}

  private rulerStatus: RulerStatus = 'Initial';
  private _rulerStatus$ = new BehaviorSubject<RulerStatus>('Initial');
  public rulerStatus$ = this._rulerStatus$.asObservable();

  private rulerPosition: number = 0;

  public setRulerStatus(status: RulerStatus) {
    this.rulerStatus = status;
    this._rulerStatus$.next(status);
  }

  public getRulerStatus() {
    return this.rulerStatus;
  }

  public setCustomPosition(position: number) {
    this.rulerPosition = position;
  }

  public getCustomPosition() {
    return this.rulerPosition;
  }
}
