import { Component } from '@angular/core';
import { OccupationsComponent } from './occupations/occupations.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  entryComponents: [OccupationsComponent]
})
export class AppComponent {
  title = 'Room Occupation Dashboard';
}
