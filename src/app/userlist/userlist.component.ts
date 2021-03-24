import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, Form } from '@angular/forms';
import { User } from '../shared/interface/user.interface'
import { uselist } from '../shared/constants/userlist'
import { Router } from '@angular/router';
declare var require: any;

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})

export class UserlistComponent implements OnInit {

  userForm: FormGroup;
  initialbtnState: string = 'Load Data'
  showTable: boolean = false;
  iterableDiffer: any;
  roles: string[] = ['IT','QA','Apps','HR','Finance'];
  userslist: User = [...uselist];
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.builform();
  }

  builform() {
    this.userForm = this.fb.group({
      users: this.fb.array([])
    });
    const control = <FormArray>this.userForm.get('users');

    for(let i=0; i < this.userslist.length;i++){
      control.push(this.formcontr());
    }
  }
  
  formcontr(){
    return this.fb.group({
      fname: [''],
      mname: [''],
      lname: [''],
      email: [''],
      phone: [''],
      role: [''],
      address: ['']
    })
  }

  togglebtn(state:string) {
    switch(state) {
      case 'Load Data':
        this.initialbtnState = "Refresh Data";
        this.showTable = true
        break;
      case "Refresh Data":
        this.userslist = [...uselist];
        this.userslist.map(el =>  el.editable = el.editable ? false : el.editable )
        break;
    }
  }

  edit(ind:string) {
    this.userslist[ind].editable = this.userslist[ind].editable ? false : true;
    const control = <FormArray>this.userForm.get('users');

    for(let key in this.userslist[ind]) {
      if(key !== 'editable') control.controls[ind].get(key).setValue(this.userslist[ind][key]);
    }
  }

  dlt(ind) {
    this.userslist.splice(ind, 1);
  }

  save(ind:string) {
    this.userslist[ind].editable = false;
    console.log(this.userForm.value);
    [this.userslist[ind]] = [this.userForm.value.users[ind]]
  }
}
