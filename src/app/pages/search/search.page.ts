import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchService } from '../../services/search/search.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  public lists: Array<any>;
  public searchForm: FormGroup;
  public loading: any;
  public keyword: string;

  constructor(
    private formBuilder: FormBuilder,
    private searchService: SearchService,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute
  ) {
    //validation
    this.searchForm = this.formBuilder.group({
      keyword: [
        '',
        Validators.compose([Validators.minLength(1), Validators.required]),
      ],
    });
  }

  ngOnInit() {
    this.keyword = this.route.snapshot.paramMap.get('keyword');
    this.lists = [];

    //search on init
    this.search(this.searchForm, false);
  }

  async search(searchForm: FormGroup, checkValid: boolean = true): Promise<void> {
    if (checkValid && !searchForm.valid) {
      console.log(
        'Need to complete the form, current value: ', searchForm.value
      );
    }
    else {
      this.searchService
        .searchListsByKeyword(this.keyword)
        .then(querySnapshot => {
          this.lists = []; //reset the lists

          querySnapshot.forEach(doc => {
            this.lists.push({
              id: doc.id,
              name: doc.data().name
            });
          });

          console.log(this.lists);
        });
    }
  }
}
