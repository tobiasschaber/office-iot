import { Component, OnInit } from '@angular/core';
import { Sensor } from '../data/sensor';
import {Room} from "../data/room";

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit {

  sensors = Array<Sensor>();
  selectedSensor: Sensor;

  rooms = Array<Room>();

  constructor() {

    let room1 = new Room("000-000-000", "Jakku", "calendarID", "service acc ID", "private key");
    let room2 = new Room("000-000-001", "Meetup-Raum", "calendarID2", "service acc ID2", "private key 2");

    this.rooms.push(room1);
    this.rooms.push(room2);

    this.sensors.push(new Sensor("ghijkl", 0, "sensor b tischmodell", "000-000-000"));
    this.sensors.push(new Sensor("abcdef", 0, "sensor a wandmodell", undefined));
  }

  ngOnInit() {

  }

  /**
   * select other sensor from the sensors list or hit the "add sensor" button
   * @param {Sensor} sensor the selected sensor, undefined if "add sensor" pushed
   */
  onSelect(sensor: Sensor) {
    if(!sensor) {
      this.selectedSensor = new Sensor("", 0, "", undefined)
      this.sensors.push(this.selectedSensor);
    } else {
      this.selectedSensor = sensor;
    }
  }

}
