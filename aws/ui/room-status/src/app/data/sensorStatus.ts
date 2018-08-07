export class SensorStatus {
  sensorId: string = '';
  lastUpdated: number = 0;
  description: string = '';
  attachedInRoom: string = '';
  lastUpdatedFormatted: string = '';

  

  constructor(sensorId: string, lastUpdated: number, description: string, attachedInRoom: string) {
    console.log("XXXXD")
    this.sensorId = sensorId;
    this.lastUpdated = lastUpdated;
    this.description = description;
    this.attachedInRoom = attachedInRoom;
    this.lastUpdatedFormatted = new Date(lastUpdated/1000).toLocaleString();
    console.log(this.lastUpdatedFormatted);
  }
}
