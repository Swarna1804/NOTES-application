import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',

  standalone: true,

  imports: [FormsModule],

  templateUrl: './signup.html',

  styleUrls: ['./signup.css']
})

export class SignupComponent {

  name = '';

  email = '';

  password = '';

  message = '';

  constructor(private router: Router) {}

  signup() {

    let users: any[] = [];
    try {
      users = JSON.parse(localStorage.getItem('users') || '[]');
      if (!Array.isArray(users)) {
        users = [];
      }
    } catch {
      users = [];
    }

    const userExists = users.find(
      (user:any) =>
        user.email === this.email
    );

    if(userExists) {

      this.message =
        'User already exists';

      return;
    }

    users.push({

      name: this.name,

      email: this.email,

      password: this.password

    });

    localStorage.setItem(
      'users',
      JSON.stringify(users)
    );

    this.message =
      'Signup Successful';

    setTimeout(() => {

      this.router.navigate(['']);

    }, 1000);

  }

}