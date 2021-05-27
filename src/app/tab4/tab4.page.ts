import { Component, Injectable } from '@angular/core';

// 16/11/20 DH:
const { getRows, copyAndDelRow, returnRows, flagNotSet } = require('../../assets/gsheet');

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  //templateUrl: 'list-group.html',
  styleUrls: ['tab4.page.scss']
})

// 12/12/20 DH: Yup making a service is the method for inter-component message passing
@Injectable({
  providedIn: 'root'
})

// 5/12/20 DH: Extend 'NgGoogleSheet' class
export class Tab4Page {
  items = [
    //'Hey, sweeet...',
  ];
  
  constructor() {}

  ngOnInit() {
    console.log('Tab4Page.ngOnInit() NOT CALLING displaySheetData()');
    
    //this.displaySheetData();
  }

  ionViewWillEnter() {
    console.log('Tab4Page.ionViewWillEnter() calling displaySheetData()');
    
    this.displaySheetData();
  }

  itemSelected(item: string, index: number) {
    console.log("Tab4Page.itemSelected(", index, "): ", item);

    // 25/11/20 DH: Since this is "Update" then need to firstly update row cache in gsheet
    //              (but firstly a refactor of gsheet.js...sweeet...)
    this.displaySheetData();
  }

  displaySheetData(){
    // 25/11/20 DH: Firstly clear the entire list
    this.items.splice(0,this.items.length);

    // 22/12/20 DH: 'getRows()' is non-blocking due to IO in 'getAddresses()'
    //let updatedrows = getRows();
    console.log('Tab4Page.displaySheetData() calling getRows()...');
    getRows();
    
    this.waitForFlag();
  }

  waitForFlag(){
    if ( flagNotSet() ) {
      console.log('waitForFlag() flagNotSet');
      setTimeout(() => { 
        this.waitForFlag();
      }, 300); // arg 2 = msecs
    } else {
      console.log('waitForFlag() flagSet');
      this.displayRows();
    }
  }

  displayRows(){
    let updatedrows = returnRows();

    // 22/11/20 DH: https://exploringjs.com/es6/ch_arrow-functions.html
    //              The arrow operator facilitating lexical 'this' binding to pass the outer this 
    //              (rather than being unknown with implicit 'this' binding)

    try {
      updatedrows.map((row, index) => {
        //console.log(`${row[2]}, ${row[3]}, ${row[4]}, ${row[5]}`);
        console.log(`${row}`);

        if(index != 0){
          this.displayMsg(row[6]+': '+row[2]+','+row[3]+','+row[4]+','+row[5]);
        }
      });
    } catch (err) {
      //console.error(err);
      console.log('Tab4Page.displayRows(): returnRows() returned: '+updatedrows);
    }

  }

  async deleteItem(item: string, index: number){
    this.items.splice(index,1);

    console.log("Tab4Page.deleteItem(", index, "): ", item);
    copyAndDelRow('Personal',index,'Deleted');
    
  }

  // 12/11/20 DH: This creates a slideable list in 'tab4.page.html'
  displayMsg(item: string) {
    // Add new entry to bottom of list
    this.items.push(item);

    // Add new entry to top of list
    //this.items.unshift(item);
  }

  

  
}
