import { Component, OnInit, Input } from '@angular/core';
import { Login } from '../Libs/Login';
import { ApiService } from '../api.service';

/**
 * Class For Header Component (DO Eager Loading)
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  /**
   * Login Token
   */
  token: string;
  /**
   * Username
   */
  username: string;
  /**
   * window
   */
  window: any;
  /**
   * Header Title
   */
  @Input() title: string;
  /**
   * Color of the title
   */
  @Input() color: string;
  /**
   * Is it a Front Page
   */
  @Input() front = false;
  /**
   * Constructor for Header
   * @param api API Service
   */
  constructor(private api: ApiService) { }
  /**
   * On Init
   */
  ngOnInit() {
    // Get Login Token
    this.token = Login.getToken();

    // If token is available then get username
    if (this.token) {
      this.api.userInfo(this.token).subscribe((v) => {
        this.username = v.username;
      }, (err) => {
        // console.log(err.status)
        console.log(err);
        // if (err.status === 401) {
        Login.logout();
        // }
      });
    }
    // Initializing window
    this.window = window;
  }
  /**
   * Redirect to login
   */
  Login() {
    Login.redirectLogin(this.front);
  }
  /**
   * Handle Logout
   */
  Logout() {
    Login.logout();
  }
}
