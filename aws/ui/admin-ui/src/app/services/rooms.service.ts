import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RoomsResponse } from "../data/rooms-response";


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

}
