

export class CreateRoomRequest {

  roomName: string = "";
  accountId: string = "";
  privateKey: string = "";
  calendarId: string = "";



  constructor(roomName: string, accountId: string, privateKey: string, calendarId: string) {
    this.roomName = roomName;
    this.accountId = accountId;
    this.privateKey = privateKey;
    this.calendarId = calendarId;

  }
}
