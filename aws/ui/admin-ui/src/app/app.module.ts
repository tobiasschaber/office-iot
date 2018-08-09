import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SensorsComponent } from './sensors/sensors.component';
import { RoomsComponent } from "./rooms/rooms.component";

import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import {HttpClientModule} from "@angular/common/http";

import { SensorDataService } from "./services/sensor-data.service";
import { RoomsDataService } from "./services/rooms.service";
import {SensorAttachmentService} from "./services/sensor-attachment-service";

@NgModule({
  declarations: [
    AppComponent,
    SensorsComponent,
    RoomsComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [ SensorDataService, RoomsDataService, SensorAttachmentService],
  bootstrap: [AppComponent]
})
export class AppModule { }

