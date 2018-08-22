
export class UpdateRoomResponse {

  statusCode: string;
  body: string;
  uuid: string;


  constructor(statusCode: string, body: string, uuid: string) {
    this.statusCode = statusCode;
    this.body = body;
    this.uuid = uuid;
  }
}
