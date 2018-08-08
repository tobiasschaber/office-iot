import { Component, OnInit } from '@angular/core';
import {Room} from "../data/room";
import {Sensor} from "../data/sensor";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  rooms = Array<Room>();
  selectedRoom: Room;

  constructor() {

    let room1 = new Room("000-000-000", "Jakku", "calendarID", "service acc ID", "private key");
    let room2 = new Room("000-000-001", "Meetup-Raum", "calendarID2", "service acc ID2", "private key 2");
    this.rooms.push(room1)
    this.rooms.push(room2)

  }

  ngOnInit() {

  }


  /**
   * select other sensor from the rooms list or hit the "add room" button
   * @param {Room} room the selected room, undefined if "add room" pushed
   */
  onSelect(room: Room) {
    if(!room) {
      this.selectedRoom = new Room("", "", "", "", "");
      this.rooms.push(this.selectedRoom);
    } else {
      this.selectedRoom = room;
    }
  }

}
