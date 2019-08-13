import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  public taskRef: firebase.firestore.CollectionReference;
  public currentList: any = {};
  public listId = this.route.snapshot.paramMap.get('id');

  constructor(private route: ActivatedRoute, ) {

    this.loadTaskRef(firebase.auth().currentUser, this.listId);

    firebase.auth().onAuthStateChanged(user => {
      this.loadTaskRef(user, this.listId);
    });


  }

  loadTaskRef(user: firebase.User, listId: any): void {
    if (user && listId) {
      this.taskRef = firebase
        .firestore()
        .collection(`/userProfile/${user.uid}`).doc()
        .collection(`/list-detail/${listId}`).doc()
        .collection("/task");
    }
  }

  createTask(
    taskName: string,
    taskDate: string,
    taskNote: string,
    isCompleted: boolean = false,
  ): Promise<firebase.firestore.DocumentReference> {
    return this.taskRef.add({
      name: taskName,
      date: taskDate,
      note: taskNote,
      isCompleted: isCompleted
    });
  }

  getTask(): firebase.firestore.CollectionReference {
    return this.taskRef;
  }

  getTaskDetail(taskId: string): firebase.firestore.DocumentReference {
    return this.taskRef.doc(taskId);
  }
}