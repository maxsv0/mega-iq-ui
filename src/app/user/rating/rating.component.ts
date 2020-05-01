import { Component, OnInit, Input } from '@angular/core';
import { Rating } from '@/_models/rating';
import { AlertService, UserService } from '@/_services';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { first } from 'rxjs/operators';
import { User } from '@/_models';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
    @Input()
    test: Rating["test"];

    @Input()
    question: Rating["question"];

    rating: Rating;
    score: Rating["score"];
    comment: Rating["comment"];
    userToken: User["token"];
    stars: boolean[] = [];
    selected: boolean = false;


    constructor(
        private userService: UserService,
        private alertService: AlertService,
        private i18n: I18n
    ) {
        this.stars = [false, false, false, false, false];
    }

  ngOnInit() {
      this.getUserToken();
  }

  getUserToken() {
      this.userService.getMyInfo()
      .pipe(first())
      .subscribe(
        apiResponseUser => {
            if (apiResponseUser.ok) return this.userToken = apiResponseUser.user.token;
        },
        error => {
            this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error.msg);
        }
      )
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
        return this.score = selectedStar + 1;
    }

    submit() {
        this.userService.sendFeedback(
        this.rating = {
            test: this.test,
            question: this.question,
            score: this.score,
            comment: this.comment || ""
        }, this.userToken)
        .pipe(first())
        .subscribe(
            response => {
                // console.log(response);
                this.alertService.success(this.i18n('Thank you for your feedback'));
                this.resetRating();
            },
            error => {
                this.alertService.error(this.i18n('API Service Unavailable') + '. ' + error.message);
            }
        );
    }

    resetRating() {
        for(let i = 0; i < this.stars.length; i++) {
            this.stars[i] = false;
        }
        this.comment = "";
        this.selected = false;
    }
}
