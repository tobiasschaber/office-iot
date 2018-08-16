export class SensorStatus {
  sensorId: string = '';
  lastUpdated: number = 0;
  description: string = '';
  attachedInRoom: string = '';
  lastUpdatedFormatted: string = '';
  sensorHasTimedOut: boolean;



  constructor(sensorId: string, lastUpdated: number, description: string, attachedInRoom: string) {
    this.sensorId = sensorId;
    this.lastUpdated = lastUpdated;
    this.description = description;
    this.attachedInRoom = attachedInRoom;
    this.lastUpdatedFormatted = new Date(lastUpdated/1000).toLocaleString();
    this.sensorHasTimedOut = false;

  }



}
