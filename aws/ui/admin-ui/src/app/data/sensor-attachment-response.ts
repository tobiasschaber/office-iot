
export class SensorAttachmentResponse {

  statusCode: string;
  body: string;

  constructor(statusCode: string, body: string) {
    this.statusCode = statusCode;
    this.body = body;
  }
}
