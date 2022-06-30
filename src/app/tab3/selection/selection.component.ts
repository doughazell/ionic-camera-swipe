import { Component, Injectable, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

// 15/5/22 DH:
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// 5/5/22 DH:
const { addKitRow, getKitRows, returnKitRows, flagNotSet } = require('../../../assets/gsheet-kit');
//const { addRow, getCachedRow } = require('../../../assets/gsheet');

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss'],
})
// 15/5/22 DH: https://angular.io/guide/http
// (we don't need this class to implement 'Injectable' because the 'Observable' is self contained)
//@Injectable()

export class SelectionComponent implements OnInit {
  // 8/5/22 DH:
  @Input("action") action: string;
  @Input("objects") objects: string[];
  
  private protocol: string;

  // 8/5/22 DH: Ideally this should be read from the google sheet for DB normalisation
  private protocolList: string[] = [
    'Bats',
    'Beetles',
    'Photographs',
    'Precipitation',
    'N-tubes',
    'Postage',
    'Other',
  ];

  private renewRows: boolean = false;

  // 6/5/22 DH:
  private items = [
    //'Hey, sweeet...',
  ];

  // 15/5/22 DH: Reply from Google Web Apps API
  errorMsg;

  constructor(private modalCtrl: ModalController, private httpclient: HttpClient) { }

  ngOnInit() {}

  // 3/5/22 DH: No 'async' required for 'close()' or 'this.modalCtrl.dismiss()' 
  //           (despite "Ionic Components: Modals" Youtube code inclusion)
  close(){
    //this.modalCtrl.dismiss({ userData: 3 });
    this.modalCtrl.dismiss("Top bannana...");
    //this.modalCtrl.dismiss();
  }

  getKitSheetValues(): string[][] {
    let ret2dArray: string[][] = [[]];

    //Protocol, Whats needed ahead of next field day?, Date of request, Date supplied, Method of supply, Comment
    // A,B,C,D,E,F
    // eg "Precipitation,,date now,,,Long Bungee"

    //ret2dArray[0] = [ this.protocol, ,"8 May", , ,this.objects.toString() ];
    //ret2dArray[0] = [ this.protocol, ,Date.now().toString(), , ,this.objects.toString() ];

    // Javascript pipe:
    //let today = {Date.now() | date: 'dd/MM/yyyy'};

    //let datetime = new Date().toISOString();
    //let date = datetime.split('T').shift();
    //console.log("GoogleSheetDH: DateTime: " + datetime);
    let date = "9/5/22";
    console.log("GoogleSheetDH: Date: " + date);

    ret2dArray[0] = [ this.protocol, ,date, , ,this.objects.toString() ];

    return ret2dArray;
  }

  // 5/5/22 DH:
  // 11/5/22 DH: This works in a browser (with the date being altered to '44690') but stops after printing
  //             the 'Action' + 'Objects' log msgs on Android...!!!
  sendToGoogleKitSheet(){
    // 8/5/22 DH: Access 'componentProps' sent to 'component: SelectionComponent'
    console.log('GoogleSheetDH: Action: ' + this.action.toString() );
    console.log('GoogleSheetDH: Objects: ' + this.objects.toString() );
    if (this.action == "need"){
      // 8/5/22 DH: Need some AI to correctly populate the kit sheet with the specified object
      let rowValues: string[][] = this.getKitSheetValues();
      console.log("GoogleSheetDH: Row: " + JSON.stringify(rowValues) );

      //let cachedRow: string = getCachedRow();
      //console.log("Cached Row: " + JSON.stringify(cachedRow) );
      //addRow(cachedRow);

      addKitRow(rowValues);
      this.renewRows = true;
      this.waitForFlag();
    }

    // 8/5/22 DH: Access google sheets again to get current list having added a row
    //getKitRows();
    //this.waitForFlag();
  }

  // 15/5/22 DH:
  sendImageToGoogleKitSheet() {
    //console.log('GoogleSheetDH: adding image via doPost()');
    //this.httpclient.post('https://script.google.com/macros/s/AKfycbw527Wo_KkHKugGphS8ahtSP0sKrgDweaVnn0WX9oQOGqXWQEmH00H3TJQ5yur_0Q-Y7Q/exec',null);
    
    //console.log('GoogleSheetDH: adding image via doGet()');
    //return this.httpclient.get('https://script.google.com/macros/s/AKfycbw527Wo_KkHKugGphS8ahtSP0sKrgDweaVnn0WX9oQOGqXWQEmH00H3TJQ5yur_0Q-Y7Q/exec');

    // 19/5/22 DH: The CORS error solution was to use 'fetch()'
    // (as detailed in https://github.com/tanaikech/taking-advantage-of-Web-Apps-with-google-apps-script#corsinwebapps)
    
    const url = 'https://script.google.com/macros/s/AKfycbw527Wo_KkHKugGphS8ahtSP0sKrgDweaVnn0WX9oQOGqXWQEmH00H3TJQ5yur_0Q-Y7Q/exec';
    const obj = { key: "value" };
    let file = '/assets/balavil-sunset.jpg';

    // 19/5/22 DH: https://developer.mozilla.org/en-US/docs/Web/API/Response/text
    // "The text() method of the Response interface takes a Response stream. It returns a promise that resolves with a String"
    
    //fetch(url, { method: "POST", body: JSON.stringify(obj) })

    fetch(file)
      .then (res => res.blob() )
      .then (blob => {

        let blobObj = { imageurl: blob };
        
        fetch(url, { method: "POST", body: JSON.stringify(obj) })
          .then((res) => {
            console.log("1st Promise: " + res.status);
            return res.text(); // Promise necessary since Response stream read to eof
          })
          .then((res) => console.log("2nd Promise: " + res));

      });
    

    /* ---------------------------------------------------------------------------------
    this.httpClientGet()
    //this.httpClientPost()
    .subscribe(
      (response) => {                           //next() callback
        console.log('response received');
        //this.repos = response; 
      },
      (error) => {                              //error() callback
        this.errorMsg = error;
        console.log('Request failed with error:' + JSON.stringify(this.errorMsg) );
        //this.errorMessage = error;
        //this.loading = false;
      },
      () => {                                   //complete() callback
        console.error('Request completed');      //This is actually not needed 
        //this.loading = false; 
      })
      ------------------------------------------------------------------------------------ */
  }

  httpClientGet(): Observable<any> {
    console.log('GoogleSheetDH: adding image via httpclient.get()');
    return this.httpclient.get('https://script.google.com/macros/s/AKfycbw527Wo_KkHKugGphS8ahtSP0sKrgDweaVnn0WX9oQOGqXWQEmH00H3TJQ5yur_0Q-Y7Q/exec');
  
  }

  // 16/5/22 DH:
  httpClientPost(): Observable<any> {
    // 17/5/22 DH:
    const httpOptions = {
      headers: new HttpHeaders({ 
        // 17/5/22 DH: Wildcard, '*', not work
        // 'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Origin':'https://script.google.com',
        //'Access-Control-Allow-Origin':'http://localhost',
      })
    };

    console.log('GoogleSheetDH: adding image via httpclient.post()');
    return this.httpclient.post('https://script.google.com/macros/s/AKfycbw527Wo_KkHKugGphS8ahtSP0sKrgDweaVnn0WX9oQOGqXWQEmH00H3TJQ5yur_0Q-Y7Q/exec',
                                { title: 'Angular POST Request Example' } );
  
  }

  // 6/5/22 DH: Copied from Tab4Page
  // ----------------------------------------------------

  waitForFlag(){
    if ( flagNotSet() ) {
      console.log('GoogleSheetDH: SelectionComponent.waitForFlag() flagNotSet');
      setTimeout( () => { 
        this.waitForFlag();
      }, 300); // arg 2 = msecs
    } else {
      if(this.renewRows) {
        console.log('GoogleSheetDH: SelectionComponent.waitForFlag() flagSet calling getKitRows()');
        this.renewRows = false;
        getKitRows();
        this.waitForFlag();
      } else {
        console.log('GoogleSheetDH: SelectionComponent.waitForFlag() flagSet calling displayRows()');
        this.displayRows();
      }
      
      // 8/5/22 DH: Using a callback for 'displayKitSheetData()' + 'displayRows()' had problems with 'this'
      //callback();
    }
  }

  displayRows(){
    this.items.splice(0,this.items.length);

    let kitrows = returnKitRows();

    try {
      kitrows.map((row, index) => {
        console.log(`${row}`);

        if(index != 0){
          // 7/5/22 DH: From 'Tab4Page.displayRows()'
          //this.displayMsg(row[6]+': '+row[2]+','+row[3]+','+row[4]+','+row[5]);
          this.displayMsg('Protocol: ' + row[0] + ', Date of request: '+ row[2]);
        }
      });
    } catch (err) {
      console.log('SelectionComponent.displayRows(): returnKitRows() returned: '+kitrows);
    }

  }

  displayMsg(item: string) {
    // Add new entry to bottom of list
    this.items.push(item);

  }
  // ============ END: code from Tab4Page ===============

}
