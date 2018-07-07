import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Feedback, ContactType } from '../shared/feedback';
import { flyInOut, expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host:{
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedbackcopy = null;
  feedback: Feedback;
  feedbackErrMess: string;
  contactType  = ContactType;
  formErrors = { 
  	'firstname': '',
  	'lastname': '',
  	'telnum': '',
  	'email': ''
  };

  validationMessages = {
  	'firstname': {
  		'required': 'Firstname is required.', 
  		'minlength': 'Firstname must be at least 2 characters long',
  		'maxlength': 'Firstname cannot be more than 25 characters long'
  	},
  	'lastname': {
  		'required': 'Lastname is required.', 
  		'minlength': 'Lastname must be at least 2 characters long',
  		'maxlength': 'Lastname cannot be more than 25 characters long'
  	},
  	'telnum': {
  		'required': 'Telephone number is required.',
  		'pattern': 'Telehone number must contain only numbers.'
  	},
  	'email': {
  		'required': 'Email is required.',
  		'email': 'Email not in valid format'
  	}
  };

  constructor(private fb: FormBuilder, private feedbackservice: FeedbackService, @Inject('BaseURL') private BaseURL ) {
  	this.createForm();
   }

  ngOnInit() {
  }

  createForm(){
  	this.feedbackForm = this.fb.group({
  		firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25) ]],
  		lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25) ]],
  		telnum: [0, [Validators.required, Validators.pattern ]],
  		email: ['', [Validators.required, Validators.email ]],
  		agree: false,
  		contacttype: 'None',
  		message: ''
  	});

  	this.feedbackForm.valueChanges
  		.subscribe(data => this.onValueChanged(data));

  	this.onValueChanged(); //(re)set form validation messages
  }

  onValueChanged(data ?: any){
  	if(!this.feedbackForm){ return; }
  	const form = this.feedbackForm;

  	for( const field in this.formErrors) {
  		this.formErrors[field] = '';
  		const control = form.get(field);
  		if(control && control.dirty && !control.valid){
  			const messages = this.validationMessages[field];
  			for (const key in control.errors){
  				this.formErrors[field] += messages[key] + ' ';
  			}
  		}
  	}
  }

  onSubmit(){
  	this.feedback = this.feedbackForm.value;
  	console.log(this.feedback);
    this.feedbackservice.submitFeedback(this.feedback)
    .subscribe( FeedBack => { this.feedbackcopy = FeedBack;
    feedbackErrMess => this.feedbackErrMess = <any> feedbackErrMess;
    setTimeout(() => this.feedback = null, '5000'), setTimeout(() => this.feedbackcopy = null, '5000')});
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
  }

}
