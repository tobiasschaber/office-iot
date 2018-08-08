

export class Room {

  roomId: string = '';
  roomName: string = 'lll';
  calendarId: string = '';
  calendarServiceAccountId: string = '';
  calendarServiceAccountPrivateKey: string = '';


  constructor(roomId: string, roomName: string, calendarId: string, calendarServiceAccountId: string, calendarServiceAccountPrivateKey: string) {
    this.roomId = roomId;
    this.roomName = roomName;
    this.calendarId = calendarId;
    this.calendarServiceAccountId = calendarServiceAccountId;
    this.calendarServiceAccountPrivateKey = calendarServiceAccountPrivateKey;
  }

}
