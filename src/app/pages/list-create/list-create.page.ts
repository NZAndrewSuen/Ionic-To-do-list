import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from '../../services/list/list.service';

@Component({
  selector: 'app-list-create',
  templateUrl: './list-create.page.html',
  styleUrls: ['./list-create.page.scss'],
})
export class ListCreatePage implements OnInit {

  constructor(
    private router: Router,
    private listService: ListService,
  ) { }

  ngOnInit() {
  }

  createList(
    listName: string,
    listAttribution: string,
  ): void {
    if (listName === undefined) {
      return;
    }

    if (listAttribution === undefined) {
      listAttribution = "";
    }

    this.listService
      .createList(listName, listAttribution)
      .then(() => {
        this.router.navigateByUrl('hpage');
      });
  }
}
