import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

    stars: boolean[];
    selected: boolean = false;
    rated: boolean = false;

  constructor() {
    this.stars = [false, false, false, false, false];
   }

  ngOnInit() {
  }

    select(selectedStar: number) {
        for(let i = 0; i < this.stars.length; i++) {
            if(i <= selectedStar) {
                this.stars[i] = true;
            } else {
                this.stars[i] = false;
            }
        }
        this.selected = true;
    }

    submit() {
        // TODO: POST REQUEST to API
        this.rated = true;
    }
}
