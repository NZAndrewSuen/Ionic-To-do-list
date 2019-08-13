import { Component, OnInit } from '@angular/core';
import { Router, Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ListService } from '../../services/list/list.service';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.page.html',
  styleUrls: ['./task-create.page.scss'],
})
export class TaskCreatePage implements OnInit {
  //get current Id and list attribution
  public listId: string;
  public taskId: string;
  public currentList: any = {};

  public taskName = '';
  public taskDate = '';
  public taskNote = '';
  public isCompleted = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private listService: ListService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
  ) {
  }

  //method of receive id
  ionViewDidEnter() {
    this.route.queryParams.subscribe((params: Params) => {
      this.listId = params['listId'];
      this.taskId = params['taskId'];
    })

    this.listService
      .getlistDetail(this.listId)
      .get()
      .then(listSnapshot => {
        this.currentList = listSnapshot.data();
        this.currentList.id = listSnapshot.id;
      })

    if (this.taskId != "-1") {
      this.listService
        .getTaskDetail(this.taskId, this.listId)
        .get()
        .then(taskSnapshot => {
          var taskData = taskSnapshot.data();
          this.taskName = taskData.taskName;
          this.taskDate = taskData.taskDate;
          this.taskNote = taskData.taskNote;
          this.isCompleted = taskData.isCompleted;
        });
    }
  }

  ngOnInit() {
  }

  submit(): void {
    if (
      this.taskName === undefined ||
      this.taskDate === undefined ||
      this.taskNote === undefined
    ) {
      return console.log("wrong");
    }

    if (this.taskId == "-1") {
      //add task
      this.listService
        .addTask(
          this.taskName,
          this.taskDate,
          this.taskNote,
          this.currentList.id,
        )
        .then(() => this.router.navigateByUrl(`/list-detail/${this.listId}`));
    }
    else {
      //edit task
      this.listService
        .updateTask(
          this.taskId,
          this.listId,
          this.taskName,
          this.taskDate,
          this.taskNote,
          this.isCompleted
        )
        .then(() => this.router.navigateByUrl(`/list-detail/${this.listId}`));
    }
  }

  async delete(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Warning',
      message: 'Do you want to delete this task?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'OK',
          handler: () => {
            this.listService
              .deleteTask(this.taskId, this.listId)
              .then(() => {
                this.router.navigateByUrl(`/list-detail/${this.listId}`);
              });
          }
        }
      ]
    });

    await alert.present();
  }
}