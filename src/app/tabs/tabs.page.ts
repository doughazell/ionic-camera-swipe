import { Component, ViewChild } from '@angular/core';
import { PhotoService } from '../services/photo.service';

// 16/10/19 DH:
import { Events } from '@ionic/angular';

// 17/10/19 DH:
import { LogService } from '../services/log.service'

// 24/11/20 DH: Like pre-loading images for Tab2, I'm attempting to pre-load the gsheet data
const { startSheets, flagNotSet, errorNotSet, getGoogleapisErr} = require('../../assets/gsheet');

// 20/5/21 DH: Changing content of default tab when Google auth error
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})

export class TabsPage {

  constructor(public photoService: PhotoService, public events: Events, public logService: LogService,
              private router: Router) {

    events.subscribe('tab2:created', (time) => {
      // time is the same arguments passed in `events.publish(time)`
      console.log('Welcome to Tab2 ', 'at', time);
  });
  }

  // 8/10/19 DH: Finding where image display delay occurs
  clickTab2() {
    console.log("Camera tab clicked: ");
  }

  // 13/10/19 DH: Increasing tab 2 gallery display time
  ngOnInit() {
    console.log("Loaded TabsPage");
    //this.tab2.presentToast();

    console.log("Loading photos in TabsPage...");
    this.photoService.loadSaved(this);
    console.log("Called 'photoService.loadSaved()' callback in TabsPage");

    this.logService.log("TabsPage called photoService.loadSaved()");
 
    // 24/11/20 DH: pre-load the gsheet data
    // 27/5/21 DH: and catch JSON google errors
    try {
      startSheets();
    } catch (e){
      console.log(e.name + ': ');
      console.log(e.message);
      //'Tab1Page.templateUrl = 'tab1NODDY.page.html';' not able to alter dynamically, need new page..
      this.router.navigate(['/tabs/tab1/google-error', e.name, e.message]);
    }
    
    this.waitForFlag();
    console.log('Leaving TabsPage.ngOnInit() after calling waitForFlag()...!');
  }

  waitForFlag(){
    if ( flagNotSet() && errorNotSet() ) {
      console.log('TabsPage.waitForFlag() flagNotSet');
      setTimeout(() => { 
        this.waitForFlag();
      }, 300); // arg 2 = msecs
    } else {
      console.log('TabsPage.waitForFlag() flagSet');
      if(errorNotSet()) {
        console.log('googleapisErr not set');

        //this.router.navigate(['/tabs/tab1/google-error', "GoogleAuthError", "Testing" ] );

      } else {
        let googleapisErr = getGoogleapisErr();
        let googleapisErrJSON = JSON.stringify(googleapisErr);
        let JSONobj = JSON.parse(googleapisErrJSON);

        //console.log('googleapisErr: '+ googleapisErr );
        //console.log(JSONobj.response.data );
        //console.log(JSONobj.response.data.error );
        //console.log(JSONobj.response.data.error_description);

        this.router.navigate(['/tabs/tab1/google-error', "GoogleAuthError", 
                              "Error: " + JSON.stringify(JSONobj.response.data.error) + 
                              ", Error desc: " + JSON.stringify(JSONobj.response.data.error_description) + 
                              ", Code: " + JSON.stringify(JSONobj.code) ]);
        
      }
    }
  }

  ngAfterViewInit() {
    //this.tab2.presentToast();
  }

  
}
