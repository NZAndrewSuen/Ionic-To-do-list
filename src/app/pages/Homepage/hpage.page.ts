import { Component, OnInit } from '@angular/core';
import { ListService } from '../../services/list/list.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { ProfileService } from '../../services/user/profile.service';

@Component({
  selector: 'app-hpage',
  templateUrl: './hpage.page.html',
  styleUrls: ['./hpage.page.scss'],
})

export class HpagePage implements OnInit {
  public keyword: string = "";
  public list: Array<any>;
  public searchForm: FormGroup;
  public userName: string = "";

  constructor(
    private listService: ListService,
    private router: Router,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
  ) {
    this.searchForm = this.formBuilder.group({
      keyword: [
        '',
        Validators.compose([Validators.minLength(1), Validators.required]),
      ],
    });

    this.profileService.userProfile
      .get()
      .then(userProfileSnapshot => {
        var userData = userProfileSnapshot.data();
        this.userName = (userData.firstName != undefined && userData.firstName.length > 0)
          ? userData.firstName
          : userData.email;
      });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.listService.getList()
      .where('isArchive', '==', false)
      .get()
      .then(listSnapshot => {
        this.list = [];
        listSnapshot.forEach(snap => {
          this.list.push({
            id: snap.id,
            name: snap.data().name,
            attribution: snap.data().attribution,
          });
          return false;
        })
      })
  }

  search(keyword: string) {
    this.router.navigateByUrl(`search/${keyword}`);
  }
}
