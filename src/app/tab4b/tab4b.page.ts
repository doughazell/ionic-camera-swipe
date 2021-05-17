// 12/12/20 DH: SimpleChanges interface then making the tab a service
import { Component, SimpleChanges, Injectable } from '@angular/core';
// 13/12/20 DH:
import { ChangeDetectorRef, ApplicationRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
// 24/10/19 DH: Dynamic CSS variables
import { DomSanitizer } from '@angular/platform-browser';

// 11/12/20 DH:
const { copyAndDelRow, getDeletedRows, flagNotSet, returnDeletedRows } = require('../../assets/gsheet');

@Component({
  selector: 'app-tab4b',
  templateUrl: 'tab4b.page.html',
  //templateUrl: '../tab4google/tab4googleNODDY.page.html',
  styleUrls: ['tab4b.page.scss'],

  // 13/12/20 DH: Not facilitate updating ion-list from tab click
  //changeDetection: ChangeDetectionStrategy.OnPush
})

// 12/12/20 DH: Yup making a service is the method for inter-component message passing...
// 14/12/20 DH: ...which was solved with 'ionViewDidEnter()' in order to update Component ViewRef
//              (https://angular.io/guide/glossary#view)
@Injectable({
  providedIn: 'root'
})

export class Tab4bPage {
  items = [
    'Hey, sweeet...',
  ];

  // 24/12/20 DH:
  waitCounter: number;

  // 13/12/20 DH: ChangeDetectorRef is Abstract Class so handled in constructor (rather than 'extends')
  constructor(private sanitizer: DomSanitizer,
              //private changeDetectorRef: ChangeDetectorRef, (see below for error)
              //private appRef: ApplicationRef,
              //private _ngZone: NgZone,
              ) {}

  getDynamicColour(colour) {
    // 24/10/19 DH: Note the backticks (``) not single quotes ('') !
    /*
       https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
       "Template literals can contain placeholders.
        These are indicated by the dollar sign and curly braces (${expression}).
        The expressions in the placeholders and the text between the back-ticks (` `) get passed 
        to a function."
     */
    return this.sanitizer.bypassSecurityTrustStyle(`--myvar: ${colour}`);
  }

  displayMsg(item: string) {
    // Add new entry to bottom of list
    this.items.push(item);

    // Add new entry to top of list
    //this.items.unshift(item);
  }

  ngOnInit() {
    console.log('Tab4bPage.ngOnInit() NOT CALLING displaySheetData()');
    //this.displaySheetData();
  }

/* --------------------------------------------------------------------------------
    // 13/12/20 DH: Attempt to get ion-list to update on tab click (before 'ionViewWillEnter()' + 'waitForFlag()' solved the prob)
    //    Causes: "NullInjectorError: StaticInjectorError(AppModule)[IonLabel -> ChangeDetectorRef]"
    //this.changeDetectorRef.detectChanges();

    //console.log('Tab4bPage.refreshItems(): calling appRef.tick()');
    // 13/12/20 DH: Not updating ion-list despite 'items' being updated (which refines the Angular mental model)
    //this.appRef.tick();

    // 13/12/20 DH: Works same as code at top of method
    this._ngZone.runOutsideAngular(() => {
      window.setTimeout(() => {
        this._ngZone.run(() => { 
          this.items.splice(0,this.items.length);
          this.displaySheetData();
          console.log('Tab4bPage.refreshItems() - items: '+this.items);

          // 13/12/20 DH: So maybe it's an Ionic issue rather than Angular...???
          
        });
      }, 1000);
      
    });
   --------------------------------------------------------------------------------
*/

  // 14/12/20 DH: https://ionicframework.com/docs/angular/lifecycle 
  //                                 vs 
  //              https://angular.io/guide/lifecycle-hooks
  // (that couldn't be achieved in 'displaySheetData()' with: ChangeDetectorRef, ApplicationRef, NgZone)
  ionViewWillEnter() {
    console.log('Tab4bPage.ionViewWillEnter() calling displaySheetData()');
    this.displaySheetData();
  }

  itemSelected(item: string, index: number) {
    console.log("Selected Item (", index, "): ", item);
    this.displaySheetData();
  }

  displaySheetData(){
    // 25/11/20 DH: Firstly clear the entire list
    this.items.splice(0,this.items.length);

    // 24/12/20 DH:
    getDeletedRows();

    this.waitCounter = 0;
    this.waitForFlag();
  }

  // 24/12/20 DH:
  waitForFlag(){
    ++this.waitCounter;

    if ( flagNotSet() ) {
      console.log('waitForFlag() flagNotSet');
      setTimeout(() => { 
        this.waitForFlag();
      }, 300); // arg 2 = msecs
    } else {
      console.log('waitForFlag() flagSet');
      this.displayRows();
    }
    // 25/12/20 DH: but no recursion stack (like libc) since non-blocking with Angular framework
    //console.log('popping recursion stack frame '+this.waitCounter);
  }

  displayRows(){

    // 11/12/20 DH: await not blocking for return with {Angular/googleapis callbacks in 'gsheet.js'}
    //let updatedrows = getDeletedRows();

    let updatedrows = returnDeletedRows();

    // 22/11/20 DH: https://exploringjs.com/es6/ch_arrow-functions.html
    //              The arrow operator facilitating lexical 'this' binding to pass the outer this 
    //              (rather than being unknown with implicit 'this' binding)
    try {
      updatedrows.map((row, index) => {
        //console.log(`${row[2]}, ${row[3]}, ${row[4]}, ${row[5]}`);
        console.log(`Tab4bPage.displayRows(): ${row}`);

        // 11/12/20 DH: Not needed for deletions sheet
        //if(index != 0){}

        this.displayMsg(row[6]+': '+row[2]+','+row[3]+','+row[4]+','+row[5]);
        
      });
    } catch (err) {
      //console.error(err);
      console.log('Tab4bPage.displayRows(): returnDeletedRows() returned: '+updatedrows);
      
    }
    
  }

  async deleteItem(item: string, index: number){
    this.items.splice(index,1);

    console.log("Tab4bPage.deleteItem(", index, "): ", item);
    copyAndDelRow('Deleted',index, 'Personal');
    
  }

}
