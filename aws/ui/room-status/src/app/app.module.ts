import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { OccupationDataService} from "./services/occupation-data.service";
import { OccupationsComponent } from './occupations/occupations.component';
import {HttpClientModule} from "@angular/common/http";
import {SensorStatusDataService} from "./services/sensor-status.service";
import {SensorStatusComponent} from "./sensorStatus/sensorStatus.component";

@NgModule({
  declarations: [
    AppComponent,
    OccupationsComponent,
    SensorStatusComponent
  ],
  imports: [
    BrowserModule, HttpClientModule
  ],
  providers: [OccupationDataService, SensorStatusDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

