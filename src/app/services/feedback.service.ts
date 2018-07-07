import { Injectable } from '@angular/core';
import {Feedback, ContactType } from '../shared/feedback';
import { Observable } from 'rxjs/Observable';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class FeedbackService {

  constructor(private restangular: Restangular) { }

  submitFeedback(feed: Feedback) : Observable<Feedback> {
  	return this.restangular.all('feedback').post(feed);
  }

}
