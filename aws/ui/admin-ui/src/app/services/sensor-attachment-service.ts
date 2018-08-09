import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SensorAttachmentRequest } from "../data/sensor-attachment-request";
import {SensorAttachmentResponse} from "../data/sensor-attachment-response";
import {Sensor} from "../data/sensor";


const SENSOR_ATTACHMENT_SERVICE_URL = environment.serviceUrl + "/sensorAttachment";

@Injectable()
export class SensorAttachmentService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {

  }

  //Observable<SensorAttachmentResponse>
  public updateSensorAttachment(sensor: Sensor): void {

    let attachmentRequest = new SensorAttachmentRequest(sensor.sensorId, sensor.attachedInRoom, sensor.description);

    let result = this.http.post<SensorAttachmentResponse>(SENSOR_ATTACHMENT_SERVICE_URL, attachmentRequest, this.httpOptions);
    result.subscribe(response => {
      if(response) {
        console.log(response);
      }
    }, err => {
      console.log("Error loading rooms from backend service"+ JSON.stringify(err));
    });

  }

}
