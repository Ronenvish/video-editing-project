import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-play-button',
  standalone: true,
  imports: [],
  templateUrl: './play-button.component.html',
  styleUrl: './play-button.component.scss',
})
export class PlayButtonComponent {
  @Output() public click = new EventEmitter();

  videoButtonPlayClick() {
    this.click.emit();
  }
}
