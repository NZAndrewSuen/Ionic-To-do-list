import { Component, OnInit } from '@angular/core';
import { ListService } from '../../services/list/list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { firestore } from 'firebase';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.page.html',
  styleUrls: ['./list-detail.page.scss'],
})
export class ListDetailPage implements OnInit {
  //get current Id and list attribution
  public listId: string;
  public currentList: any = {};
  //task
  public task: Array<any>;

  public taskName = '';
  public taskDate = '';
  public taskNote = '';

  constructor(
    private alertCtrl: AlertController,
    private listService: ListService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }

  //method of pass id
  passId(taskId: string) {
    this.router.navigate(['task-create'], {
      queryParams: {
        listId: this.route.snapshot.paramMap.get('id'),
        taskId: taskId
      }
    });
  }

  //get specific info of the list
  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id');

    this.listService
      .getlistDetail(this.listId)
      .get()
      .then(listSnapshot => {
        this.currentList = listSnapshot.data();
        this.currentList.id = listSnapshot.id;
      });
  }

  //query and push task
  ionViewWillEnter() {
    this.getTask().get()
      .then(taskSnapshot => {
        this.task = [];
        taskSnapshot.forEach(snap => {
          this.task.push({
            id: snap.id,
            taskName: snap.data().taskName,
            taskDate: snap.data().taskDate,
            taskNote: snap.data().taskNote,
            isCompleted: snap.data().isCompleted
          });
          return false;
        })
      })
  }

  //alter of archieve
  async warnArchive() {
    const alert = await this.alertCtrl.create({
      header: 'Warning',
      message: 'Do you want to archive this list?',
      buttons: [{
        text: 'Yes',
        role: 'Yes',
        cssClass: 'secondary',
        handler: () => {
          this.clickArchive();
        }
      }, {
        text: 'No',
        handler: () => {
          console.log('Do not archive');
        }
      }]
    })
    await alert.present();
  }

  //alter of delete
  async warnDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Warning',
      message: 'Do you want to delete this list?',
      buttons: [{
        text: 'Yes',
        role: 'Yes',
        cssClass: 'secondary',
        handler: () => {
          this.deleteList();
        }
      }, {
        text: 'No',
        handler: () => {
          console.log('Do not delete');
        }
      }]
    })
    await alert.present();
  }

  //see the detail of the task
  async taskDetail() {
    const alert = await this.alertCtrl.create({
      header: 'Note',
      message: 'This is a test',
      buttons: ['Ok']
    })
    await alert.present();
  }

  //get task
  getTask(): firebase.firestore.CollectionReference {
    const listId = this.route.snapshot.paramMap.get('id');
    if (listId) {
      return this.listService.getlistDetail(listId)
        .collection("task")
    }
  }

  /*get task detail
  getTaskDetail(taskId:string):firebase.firestore.DocumentReference{
    const listId = this.route.snapshot.paramMap.get('id');
    if(listId){
    return this.listService.getlistDetail(listId)
    .collection("task").doc(taskId)}
  }*/

  //archive lists when click relevent button
  clickArchive() {
    const listId = this.route.snapshot.paramMap.get('id');
    this.listService
      .getlistDetail(listId)
      .update({ isArchive: true })
      .then(() => {
        this.router.navigateByUrl("hpage");
      });
  }

  //delete lists
  deleteList() {
    const listId = this.route.snapshot.paramMap.get('id');
    this.listService.getlistDetail(listId).delete()
      .then(() => this.router.navigateByUrl("hpage"));
  }
}