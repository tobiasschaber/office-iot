import { Component, OnInit } from '@angular/core';
import { Sensor } from '../data/sensor';
import { Room } from "../data/room";

import { SensorDataService } from '../services/sensor-data.service';
import { RoomsDataService } from "../services/rooms.service";


@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit {


  sensors: Array<Sensor>;
  rooms: Array<Room>;
  selectedSensor: Sensor; // sensor which is currently selected for editing in ui

  model = "";

  constructor(private sensorDataService: SensorDataService, private roomDataService: RoomsDataService) {
    this.sensors = [];
    this.rooms = [];
  }

  ngOnInit() {
    this.loadRooms();
    this.loadSensors();

  }


  /**
   * select other sensor from the sensors list or hit the "add sensor" button
   * @param {Sensor} sensor the selected sensor, undefined if "add sensor" pushed
   */
  onSelect(sensor: Sensor) {
    if(!sensor) {
      this.selectedSensor = new Sensor("", 0, "", "")
      this.sensors.push(this.selectedSensor);
    } else {
      this.selectedSensor = sensor;
    }
  }


  /**
   * load sensors from the service
   */
  loadSensors() {
    console.log("LOADING SENSORS");

    this.sensorDataService.getSensors()
      .subscribe(response => {
        if(response) {
          this.sensors = response.sensors;
        }

      }, err => {
        console.log("Error loading sensors from backend service");
      });
  }


  /**
   * load rooms from service
   */
  loadRooms() {
    this.roomDataService.getRooms()
      .subscribe(response => {
        if(response) {
          this.rooms = response.rooms;
        }
      }, err => {
        console.log("Error loading rooms from backend service");
      });
  }
}
