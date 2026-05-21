import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',

  standalone: true,

  imports: [FormsModule],

  templateUrl: './login.html',

  styleUrl: './login.css'
})

export class LoginComponent {

  username = '';

  password = '';

  errorMessage = '';

  constructor(private router: Router) {}

  login() {

    const users =
      JSON.parse(
        localStorage.getItem('users') || '[]'
      );

    const validUser = users.find(
      (user:any) =>

        user.email === this.username
        &&
        user.password === this.password
    );

    if(validUser) {

      localStorage.setItem(
        'loggedIn',
        'true'
      );

      localStorage.setItem(
        'currentUser',
        validUser.name
      );

      this.router.navigate(['/notes']);

    }

    else {

      this.errorMessage =
        'Invalid Email or Password';

    }

  }

  goToSignup() {

    this.router.navigate(['/signup']);

  }

}