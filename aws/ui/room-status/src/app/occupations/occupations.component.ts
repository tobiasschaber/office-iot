
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
  hist : { [key:string]:Array<String> } = {};

  constructor(private occupationDataService: OccupationDataService) {
    this.occupations = [];
    this.hist = {};
  }

  ngOnInit() {
    console.log("=========== INIT ===============");
    var occ = new Occupation("someRoomId", "name", "free");
    var occ2 = new Occupation("someRoomId2", "anderer name", "free");
    this.occupations.push(occ);
    this.occupations.push(occ2);

    this.timerSubscription = timer(50, 800).subscribe(() => {
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
            console.log(this.hist);

            for(var i=0; i<rooms.length; i++) {

              /* init for room if not already done */
              if(!this.hist[rooms[i].roomId]) {
                this.hist[rooms[i].roomId] = [];
              }

              /* push a new status into the history */
              this.hist[rooms[i].roomId].push(rooms[i].status);

              /* keep max list length */
              if(this.hist[rooms[i].roomId].length > 20) {
                this.hist[rooms[i].roomId].shift();
              }


              console.log(this.hist[rooms[i].roomId])
            }



          }
        }
      }, err => {
        console.log(err);
      });
  }

}


