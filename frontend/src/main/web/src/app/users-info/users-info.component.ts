import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { TokenStorageService } from '../auth/token-storage.service';

import { UserService } from '../services/user.service';
import { UserModel } from '../services/user-model';


@Component({
  selector: 'app-users-info',
  templateUrl: './users-info.component.html',
  styleUrls: ['./users-info.component.css']
})
export class UsersInfoComponent implements OnInit {

  trainers: UserModel[];
  managers: UserModel[];
  students: UserModel[];

  currentJustify = 'start';

  loggedOut = false;

  constructor(private router: Router, private userService: UserService, private token: TokenStorageService) {
  }

  ngOnInit() {
    if (this.token.getToken()) {
      this.userService.getTrainers()
        .subscribe(data => {
          this.trainers = data;
        })
      this.userService.getManagers()
        .subscribe(data => {
          this.managers = data;
        })
      this.userService.getStudents()
        .subscribe(data => {
          this.students = data;
        })
    } else {
      this.loggedOut = true;
      this.router.navigate(['auth/login']);
    };
  };

  logout() {
    this.loggedOut = true;
    this.token.signOut();
    window.location.reload();
    this.router.navigate(['auth/login']);
  }

  deleteUser(id: number){
    this.userService.delete(id).subscribe(data=>{
      console.log(data);
    });
  this.reloadPage();
  }

  reloadPage() {
    window.location.reload();
  }

}



