export class Occupation {
  roomId: string = '';
  roomName: string = '';
  status: string = '';

  constructor(roomId: string, roomName: string, status: string) {
    this.roomId = roomId;
    this.roomName = roomName;
    this.status = status;
  }
}
