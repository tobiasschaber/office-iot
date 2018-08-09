import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SensorResponse } from "../data/sensor-response";


const SENSOR_STATUS_SERVICE_URL = environment.serviceUrl + "/sensor";

@Injectable()
export class SensorDataService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {

  }


  public getSensors(): Observable<SensorResponse> {
    return this.http.get<SensorResponse>(SENSOR_STATUS_SERVICE_URL, this.httpOptions);
  }

}
