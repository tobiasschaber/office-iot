import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { OccupationDataService} from "./services/occupation-data.service";
import { OccupationsComponent } from './occupations/occupations.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    OccupationsComponent
  ],
  imports: [
    BrowserModule, HttpClientModule
  ],
  providers: [OccupationDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

