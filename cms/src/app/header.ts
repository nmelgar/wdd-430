import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  @Output() selectedFeatureEvent = new EventEmitter<string>();

  onSelected(selectedEvent: string) {
    this.selectedFeatureEvent.emit(selectedEvent);
  }
}
