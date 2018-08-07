
import {SensorStatus} from './sensorStatus';

export class SensorStatusResponse {

  sensors: Array<SensorStatus>;

  constructor() {
    this.sensors = [];
  }
}
