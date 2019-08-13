import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { ListService } from '../list/list.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(
    private listService: ListService
  ) { }

  //search lists by keyword
  searchListsByKeyword(keyword: string): Promise<any> {
    var user = firebase.auth().currentUser;
    var lists = [];

    if (keyword.length >= 0 && user) {
      var endCode = this.getEndCode(keyword);

      return this.listService
        .getList()
        .where("name", ">=", keyword)
        .where("name", "<", endCode)
        //one method to search "start with" in firebase is to use >= keyword and < endcode of keyword
        //e.g. if we would like to search name start with "tob", we could implement as follows:
        //name >= "tob" and name < "toc"
        //in the above case, "tob" is keyword and "toc" is endCode
        .get()
    }
  }

  //get endCode, to support function searchListsByKeyword
  private getEndCode(strSearch: string): string {
    if (strSearch.length > 0) {
      var strlength = strSearch.length;
      var strFrontCode = strSearch.slice(0, strlength - 1);
      var strEndCode = strSearch.slice(strlength - 1, strSearch.length);
      var startcode = strSearch;

      return strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
    }
    else {
      return "";
    }
  }
}