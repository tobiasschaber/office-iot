import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OccupationResponse } from '../data/occupation-response';


const OCCUPATION_SERVICE_URL = environment.occupationServiceUrl;

@Injectable()
export class OccupationDataService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {

  }


  public getRoomOccupationStatus(): Observable<OccupationResponse> {
    return this.http.get<OccupationResponse>(OCCUPATION_SERVICE_URL, this.httpOptions);
  }

}
