import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

// 6/12/20 DH:
import { ErrorHandler } from '@angular/core';
import { Injectable } from '@angular/core';

// 11/12/20 DH: Similar to 'TabsPage.ngOnInit()' calling 'startSheets()'
const { getDeletedRows } = require('../../assets/gsheet');

// 12/12/20 DH: Now a service
import { Tab4bPage } from '../tab4b/tab4b.page';
import { Tab4Page } from '../tab4/tab4.page';
//import { NgZoneDemo } from '../tab4b/ngZoneDemo.page';

@Component({
  selector: 'app-tab4google',
  // 24/12/20 DH: In the end this class was used to provide <ion-tabs> in 'tab4google.page.html'
  //              (the rest left in for future reference of Angular 8 features)
  templateUrl: 'tab4google.page.html',
  styleUrls: ['tab4google.page.scss'],
})

@Injectable()

//export class Tab4GooglePage implements ErrorHandler, AfterViewInit {
export class Tab4GooglePage implements ErrorHandler {

  // 12/12/20 DH: ViewChild didn't work with my nested tabs in Angular 8
  //@ViewChild('app-tab4b', {static: false})
  //@ViewChild(Tab4bPage, {static: false})
  //@ViewChild('/tabs/tab4google/tab4google/tab4b',{static: false})
  //@ViewChild('tab4google/tab4b',{static: false})
  //
  //private tab4b: Tab4bPage;

  constructor(private router: Router, private tab4b: Tab4bPage, private tab4: Tab4Page,
              //private ngZoneDemo: NgZoneDemo
              ) {}

  ngOnInit() {
    console.log("Tab4GooglePage.ngOnInit() NOT CALLING getDeletedRows");
    // 11/12/20 DH:
    //getDeletedRows();
  }

/*
  ngAfterViewInit() {
    // 12/12/20 DH: ...oh the legacy of this code...:)
    //this.tab2.presentToast();

    // 12/12/20 DH: Waiting for 3secs didn't help resolve 'tab4b'....argggg....!!!
    //              ...could be an Angular 8 DOM Component thing with nested tabs...???
    // 14/12/20 DH: ...nope, it was an Ionic lifecycle hook issue.
    setTimeout(() => {
      // 12/12/20 DH: Maybe necessary to assign a component link from the newly created DOM
      console.log('Tab4GooglePage.ngAfterViewInit() attempting to create tab4b: '+this.tab4b);
    }, 2000); // arg 2 = msecs

  }
*/

  // 6/12/20 DH:
  handleError(error) {
    console.log(`Tab4GooglePage: ${error}`); 
  }

  clickTab4() {
    console.log('Tab4GooglePage.clickTab4() NOT CALLING displaySheetData(): '+this.router.url);
    //this.tab4.displaySheetData();
  }

  clickTab4b() {
    console.log('Tab4GooglePage.clickTab4b() NOT CALLING displaySheetData(): '+this.router.url);
/*
    this.router.events.pipe(
      filter(event => event instanceof RouterEvent) ).subscribe( (e) => {
        console.log(e);
      } );
*/

  }
  
}
