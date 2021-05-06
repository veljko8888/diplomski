import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/@core/mock/users.service';

@Component({
  selector: 'ngx-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  userDetails;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userDetails = this.userService.getCurrentUser();
  }

}
