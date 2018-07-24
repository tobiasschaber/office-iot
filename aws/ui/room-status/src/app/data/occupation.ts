export class Occupation {
  roomId: string = '';
  roomName: string = '';
  status: string = '';
  color: string = '';

  constructor(roomId: string, roomName: string, status: string) {
    this.roomId = roomId;
    this.roomName = roomName;
    this.status = status;

    if(this.status === "occupied") {
      this.color = "red";
    } else {
      if(this.status === "free") {
        this.color = "green";
      } else {
        this.color = "gray";
      }
    }
  }
}
