

export class Sensor {
  sensorId: string = '';
  lastUpdated: number = 0;
  description: string = '';
  attachedInRoom: string = '';


  constructor(sensorId: string, lastUpdated: number, description: string, attachedInRoom: string) {
    this.sensorId = sensorId;
    this.lastUpdated = lastUpdated;
    this.description = description;
    this.attachedInRoom = attachedInRoom;
  }
}
