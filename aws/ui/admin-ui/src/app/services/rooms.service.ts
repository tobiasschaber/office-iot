import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RoomsResponse } from "../data/rooms-response";
import {Room} from "../data/room";
import {CreateRoomResponse} from "../data/create-room-response";
import {CreateRoomRequest} from "../data/create-room-request";


const ROOMS_STATUS_SERVICE_URL = environment.serviceUrl + "/room";

@Injectable()
export class RoomsDataService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };


  constructor(private http: HttpClient) {

  }


  public getRooms(): Observable<RoomsResponse> {
    return this.http.get<RoomsResponse>(ROOMS_STATUS_SERVICE_URL, this.httpOptions);
  }


  //Observable<SensorAttachmentResponse>
  public createRoom(room: Room): Observable<CreateRoomResponse> {
    let createRoomRequest = new CreateRoomRequest(room.roomName, room.calendarServiceAccountId, room.calendarServiceAccountPrivateKey, room.calendarId);

    return this.http.post<CreateRoomResponse>(ROOMS_STATUS_SERVICE_URL, createRoomRequest, this.httpOptions);
  }

}
