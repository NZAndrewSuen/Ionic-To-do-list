import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})

export class ListService {
  public listRef: firebase.firestore.CollectionReference;

  constructor(private route: ActivatedRoute) {
    this.loadListRef(firebase.auth().currentUser);

    firebase.auth().onAuthStateChanged(user => {
      this.loadListRef(user);
    });
  }

  //functions related to list

  loadListRef(user: firebase.User): void {
    if (user) {
      this.listRef = firebase
        .firestore()
        .collection(`/userProfile/${user.uid}/list`);
    }
  }

  createList(
    listName: string,
    listAttribution: string,
    isArchive: boolean = false
  ): Promise<firebase.firestore.DocumentReference> {
    return this.listRef.add({
      name: listName,
      attribution: listAttribution,
      isArchive
    });
  }

  getList(): firebase.firestore.CollectionReference {
    return this.listRef;
  }

  getlistDetail(listId: string): firebase.firestore.DocumentReference {
    return this.listRef.doc(listId);
  }

  //end functions related to list

  //functions related to task

  addTask(
    taskName: string,
    taskDate: string,
    taskNote: string,
    listId: string, ): Promise<firebase.firestore.DocumentReference> {
    return this.listRef
      .doc(listId)
      .collection("task").add({ taskName, taskDate, taskNote, isCompleted: false })
  }

  getTaskDetail(id: string, listId: string): firebase.firestore.DocumentReference {
    return this.listRef
      .doc(listId)
      .collection("task")
      .doc(id);
  }

  updateTask(
    id: string,
    listId: string,
    taskName: string,
    taskDate: string,
    taskNote: string,
    isCompleted: boolean
  ): Promise<void> {
    return this.listRef
      .doc(listId)
      .collection("task")
      .doc(id)
      .update({
        taskName: taskName,
        taskDate: taskDate,
        taskNote: taskNote,
        isCompleted: isCompleted
      });
  }

  deleteTask(id: string, listId: string): Promise<void> {
    return this.listRef
      .doc(listId)
      .collection("task")
      .doc(id)
      .delete();
  }

  //end functions related to task
}
