

export class UpdateRoomRequest {

  roomId: string = "";
  roomName: string = "";
  accountId: string = "";
  privateKey: string = "";
  calendarId: string = "";



  constructor(roomId: string, roomName: string, accountId: string, privateKey: string, calendarId: string) {
    this.roomId = roomId;
    this.roomName = roomName;
    this.accountId = accountId;
    this.privateKey = privateKey;
    this.calendarId = calendarId;

  }
}
