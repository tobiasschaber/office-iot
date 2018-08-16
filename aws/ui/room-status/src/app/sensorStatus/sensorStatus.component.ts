
import {Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {SensorStatus} from '../data/sensorStatus';
import {SensorStatusDataService} from '../services/sensor-status.service';

import {timer} from 'rxjs/observable/timer';
import {Subscription} from 'rxjs/Subscription';

const SENSOR_WARN_TIME = 30*1000;


@Component({
  selector: 'sensorStatus',
  templateUrl: './sensorStatus.component.html',
  styleUrls: ['./sensorStatus.component.css']
})


export class SensorStatusComponent implements OnInit {

  private timerSubscription: Subscription;

  sensors: Array<SensorStatus>;

  constructor(private sensorStatusDataService: SensorStatusDataService) {
    this.sensors = [];

  }

  ngOnInit() {
    var sensor1 = new SensorStatus("sensorId1", 0, "description1", "room");
    var sensor2 = new SensorStatus("sensorId2", 0, "description2", "room");

    this.sensors.push(sensor1);
    this.sensors.push(sensor2);

    this.timerSubscription = timer(50, 5000).subscribe(() => {
      this.loadSensorStatus();
    });
  }


  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }

  private loadSensorStatus() {
    console.log("loading sensor status");
    this.sensorStatusDataService.getSensorStatus()
      .subscribe(response => {
        if(response) {

          const loadedSensors = response.sensors;

          if(loadedSensors && loadedSensors.length > 0) {
            console.log("UPD");
            this.sensors = loadedSensors;
          }
        }
      }, err => {
        console.log(err);
      });
  }

  /**
   * check if a sensor warning should be displayed depending on how old the last sensor data is
   * @param {SensorStatus} sens the sensor to check
   * @return {boolean | boolean} true if a warning should be shown, otherwise false
   */
  showSensorWarning(sens: SensorStatus) {
    return sens.lastUpdated < (new Date().getTime() - SENSOR_WARN_TIME) ? true: false;
  }

}


