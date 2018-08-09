

export class SensorAttachmentRequest {

  sensorId: string = "";
  roomId: string = "";
  description: string = "";


  constructor(sensorId: string, roomId: string, description: string) {
    this.sensorId = sensorId;
    this.roomId = roomId;
    this.description = description;

  }
}
