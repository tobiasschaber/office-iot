import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SensorStatusResponse } from '../data/sensorStatus-response';


const SENSOR_STATUS_SERVICE_URL = environment.serviceUrl + "/sensor";

@Injectable()
export class SensorStatusDataService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {

  }


  public getSensorStatus(): Observable<SensorStatusResponse> {
    return this.http.get<SensorStatusResponse>(SENSOR_STATUS_SERVICE_URL, this.httpOptions);
  }

}
