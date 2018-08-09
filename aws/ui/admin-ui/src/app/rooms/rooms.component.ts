import { Component, OnInit } from '@angular/core';
import {Room} from "../data/room";

import { RoomsDataService} from "../services/rooms.service";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  rooms: Array<Room>;
  selectedRoom: Room; // room which is currently selected for editing in ui

  constructor(private roomsDataService: RoomsDataService) {
    this.rooms = [];
  }

  ngOnInit() {
    this.loadRooms();

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


  /**
   * load rooms from service
   */
  loadRooms() {
    this.roomsDataService.getRooms()
      .subscribe(response => {
        if(response) {
          this.rooms = response.rooms;
        }
      }, err => {
        console.log("Error loading rooms from backend service");
      });
  }

}
