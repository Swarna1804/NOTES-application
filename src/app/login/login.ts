import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({

  selector: 'app-login',

  standalone: true,

  imports: [FormsModule],

  templateUrl: './login.html',

  styleUrls: ['./login.css']

})

export class LoginComponent {

  username = '';

  password = '';

  errorMessage = '';

  isGoogleSigningIn = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {

    let users: any[] = [];
    try {
      users = JSON.parse(localStorage.getItem('users') || '[]');
      if (!Array.isArray(users)) {
        users = [];
      }
    } catch {
      users = [];
    }

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

  googleLogin() {
    if (this.isGoogleSigningIn) {
      return;
    }

    this.isGoogleSigningIn = true;
    this.errorMessage = '';

    this.authService
      .loginWithGoogle()
      .then(result => {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem(
          'currentUser',
          result.user.displayName || 'Google User'
        );
        this.router.navigate(['/notes']);
      })
      .catch(error => {
        console.error(error);
        if (error?.code === 'auth/popup-blocked') {
          this.errorMessage =
            'Popup blocked by the browser. Allow popups for localhost and try again.';
        } else if (error?.code === 'auth/cancelled-popup-request') {
          this.errorMessage =
            'You closed the sign-in popup or another sign-in request was cancelled. Try again.';
        } else {
          this.errorMessage =
            'Google sign-in failed. Please try again or use email login.';
        }
      })
      .finally(() => {
        this.isGoogleSigningIn = false;
      });
  }

  goToSignup() {

    this.router.navigate(['/signup']);

  }

}