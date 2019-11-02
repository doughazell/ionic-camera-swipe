import { Injectable } from '@angular/core';
import { Tab3Page } from '../tab3/tab3.page';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private tab3: Tab3Page;
  private msgBuffer = [];

  constructor() { }

  setTab3Page(tab: Tab3Page){
    this.tab3 = tab;
  }

  log(msg){
    if(this.tab3) {
      // 17/10/19 DH: Firstly clear any buffered msg's.
      for (var index in this.msgBuffer ){
        this.tab3.displayMsg(this.msgBuffer.shift());
      }

      this.tab3.displayMsg(msg);
    }
    else {
      this.msgBuffer.unshift(msg);
    }
  }
}
