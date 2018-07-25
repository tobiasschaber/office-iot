
import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {Occupation} from '../data/occupation';
import {OccupationDataService} from '../services/occupation-data.service';

import {timer} from 'rxjs/observable/timer';
import {Subscription} from 'rxjs/Subscription';


@Component({
  selector: 'occupations',
  templateUrl: './occupations.component.html',
  styleUrls: ['./occupations.component.css']
})


export class OccupationsComponent implements OnInit {

  private timerSubscription: Subscription;

  occupations: Array<Occupation>;

  constructor(private occupationDataService: OccupationDataService) {
    this.occupations = [];
  }

  ngOnInit() {
    console.log("=========== INIT ===============");
    var occ = new Occupation("someRoomId", "name", "free");
    var occ2 = new Occupation("someRoomId2", "anderer name", "free");
    this.occupations.push(occ);
    this.occupations.push(occ2);

    this.timerSubscription = timer(50, 3000).subscribe(() => {
      this.loadOccupations();
    });
  }


  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }

  private loadOccupations() {
    console.log("loading occupations");
    this.occupationDataService.getRoomOccupationStatus()
      .subscribe(response => {
        if(response) {
          const rooms = response.rooms;
          if(rooms && rooms.length > 0) {
            this.occupations = rooms;
          }
        }
      }, err => {
        console.log(err);
      });
  }

}


