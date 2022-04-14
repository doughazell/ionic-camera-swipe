import { Injectable } from '@angular/core';
import { Tab3Page } from '../tab3/tab3.page';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private tab3: Tab3Page;
  private msgBuffer: string[] = [];

  constructor() { }

  setTab3Page(tab: Tab3Page){
    this.tab3 = tab;
  }

  log(msg){
    if(this.tab3) {
      this.tab3.displayMsg(msg);
    }
    else {
      this.msgBuffer.push(msg);
      console.log("msgBuffer len: "+this.msgBuffer.length);
    }
  }

  flushBuffer(){
    // 17/10/19 DH: Firstly clear any buffered msg's.
    /*
    for (var index in this.msgBuffer ){
      this.tab3.displayMsg(index+") "+this.msgBuffer.shift());
    }
    */
    // 31/1/22 DH: now clearing ALL the elements of the string array...!
    console.log("msgBuffer len: "+this.msgBuffer.length);
    for (let entry of this.msgBuffer){
      this.tab3.displayMsg(entry);
      console.log("Removed: "+entry);

      // 31/1/22 DH: This had problems with 'of' to clear at same time as interate...
      //   ...typescript transpiles to javascript so clearly doing unusual thing with DOM object
      //   (prob reason why 'in' above to get indices rather than entries didn't work with 'shift()')
      //this.msgBuffer.pop();
    }
    // now clear buffer
    this.msgBuffer = [];
    console.log("msgBuffer len: "+this.msgBuffer.length);

  }

}
