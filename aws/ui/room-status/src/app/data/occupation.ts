export class Occupation {
  roomId: string = '';
  status: string = '';

  constructor(roomId: string, status: string) {
    this.roomId = roomId;
    this.status = status;
  }
}
