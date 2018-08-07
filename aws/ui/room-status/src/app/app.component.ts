import { Component } from '@angular/core';
import { OccupationsComponent } from './occupations/occupations.component';
import {SensorStatusComponent} from "./sensorStatus/sensorStatus.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  entryComponents: [OccupationsComponent, SensorStatusComponent]
})
export class AppComponent {
  title = 'Room Occupation Dashboard';
}
