import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Occupation } from '../data/occupation';
import {of} from 'rxjs/observable/of';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OccupationResponse } from '../data/occupation-response';

// ProxyRequest benötigt?



const OCCUPATION_SERVICE_URL = environment.occupationServiceUrl;

@Injectable()
export class OccupationDataService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //'Access-Control-Allow-Origin' : '*',
      //'Access-Control-Allow-Credentials' : 'true',
      //'Access-Control-Allow-Headers' : 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,access-control-allow-credentials'
    })
  };

  constructor(private http: HttpClient) {

  }


  public getRoomOccupationStatus(): Observable<OccupationResponse> {
    console.log("HIER WAR ICH!!!");
    return this.http.get<OccupationResponse>(OCCUPATION_SERVICE_URL, this.httpOptions);
  }

}
