import { Component, OnInit } from '@angular/core';
import { ListService } from '../../services/list/list.service';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.page.html',
  styleUrls: ['./archive.page.scss'],
})
export class ArchivePage implements OnInit {
  public newlist: Array<any>;
  public listId: string;

  constructor(
    private listService: ListService,
    private router: Router,
    public navCtrl: NavController,
    public toastController: ToastController,
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.listService
    .getList()
    .get()
      .then(listSnapshot => {
        this.newlist = [];
        listSnapshot.forEach(snap => {
          this.newlist.push({
            id: snap.id,
            name: snap.data().name,
            attribution: snap.data().attribution,
            isArchive: snap.data().isArchive,
          });
          return false;
        })
      })
  }
}