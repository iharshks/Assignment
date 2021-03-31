import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, Form } from '@angular/forms';
import { User } from '../shared/interface/user.interface'
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})

export class UserlistComponent implements OnInit {

  userForm: FormGroup;
  addUserForm: FormGroup
  initialbtnState: string = 'Load Data'
  showTable: boolean = false;
  iterableDiffer: any;
  roles: string[] = ['IT','QA','Apps','HR','Finance'];
  userslist: User = [];
  closeResult: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _http: HttpClient,
    private modalService: NgbModal
    ) {}

  ngOnInit(): void {
    this.getUserlists()
  }

  getUserlists(){
    this._http.get(environment.backendurl + 'users').subscribe((res: {users: User}) => {
      if(res.users) {
        this.userslist = res.users;
        this.builform();
      }
    }, (err: Error ) => console.log(err))
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
      fname: ['', Validators.required],
      mname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      role: ['', Validators.required],
      address: ['', Validators.required]
    })
  }

  togglebtn(state:string) {
    switch(state) {
      case 'Load Data':
        this.initialbtnState = "Refresh Data";
        this.showTable = true
        break;
      case "Refresh Data":
        this.getUserlists()
        break;
    }
  }

  edit(ind:string) {
    this.userslist[ind].editable = this.userslist[ind].editable ? false : true;
    const control = <FormArray>this.userForm.get('users');

    for(let key in this.userslist[ind]) {
      if(key !== 'editable' && key !== 'id') control.controls[ind].get(key).setValue(this.userslist[ind][key]);
    }
  }

  dlt(ind) {

    this._http.delete(`${environment.backendurl}users/${this.userslist[ind].id}`).subscribe((res: {users: User}) => {
      if(res.users) {
        this.userslist = res.users;
      }
    }, (err: Error ) => console.log(err) )
  }

  save(ind:string) {
    this.userslist[ind].editable = false;
    const control = <FormArray>this.userForm.get('users');
    if(control.controls[ind].invalid) return;
    const payload = {};

    for(let key in control.controls[ind].controls) {
      console.log(control.controls[ind].controls[key].dirty)
      if(control.controls[ind].controls[key].dirty) {
        payload[key] = control.controls[ind].controls[key].value;
      }
    }
    this._http.patch(`${environment.backendurl}users/${this.userslist[ind].id}`, payload ).subscribe((res: {users: User}) => {
      if(res.users) {
        this.userslist = res.users;
        [this.userslist[ind]] = [res.users[ind]]
      }
    }, (err: Error ) => console.log(err) )
  }

  open(content) {
    this.addUserForm = this.formcontr();

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
      this.closeResult = `Dismissed `;
    });
  }

  addNewEntry() {
    if(this.addUserForm.invalid) return;

    const control = <FormArray>this.userForm.get('users');
    control.push(this.formcontr());

    this._http.post(environment.backendurl + 'users', this.addUserForm.value).subscribe((res: {users: User}) => {
      if(res.users) {
        this.userslist = res.users;
      }
    }, (err: Error ) => console.log(err) )
    this.modalService.dismissAll();
  }
}
