import { Component, OnInit } from '@angular/core';
import{ Dish } from '../shared/dish';
import { Params , ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import 'rxjs/add/operator/switchmap';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;

  commentForm: FormGroup;
  comment: Comment;

  constructor( private dishservice: DishService, 
  private route: ActivatedRoute, private location: Location, private fb: FormBuilder) { 
      this.createForm();
   }

  ngOnInit() {
    this.dishservice.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds);

  	this.route.params
      .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
  	  .subscribe(dish => {this.dish = dish ; this.setPrevNext(dish.id)});
  }

  setPrevNext(dishId: number){
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
  	this.location.back();
  }

  createForm(){
    this.commentForm = this.fb.group({
      rating: 5,
      comment: '',
      author: '',
    });
  }

  onSubmit(){
    this.comment = this.commentForm.value;
    console.log(this.comment);
    this.commentForm.reset();
  }

}
