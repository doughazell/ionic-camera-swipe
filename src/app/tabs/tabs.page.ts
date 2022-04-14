import { Component, ViewChild } from '@angular/core';
import { PhotoService } from '../services/photo.service';

// 16/10/19 DH:
import { Events } from '@ionic/angular';

// 17/10/19 DH:
import { LogService } from '../services/log.service';

// 24/11/20 DH: Like pre-loading images for Tab2, I'm attempting to pre-load the gsheet data
const { startSheets, flagNotSet, errorNotSet, getGoogleapisErr } = require('../../assets/gsheet');

// 20/5/21 DH: Changing content of default tab when Google auth error
import { Router } from '@angular/router';

// 30/1/22 DH: Attempting to add speech recognition (prior to Reinforcement Learning from cmd)
//import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';

// 3/2/22 DH: Creating SpeechService so that it can be called from multiple classes like LogService
import { SpeechService } from '../services/speech.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})

export class TabsPage {

  constructor(public photoService: PhotoService, public events: Events, public logService: LogService,
              //private router: Router, private speechRecognition: SpeechRecognition) {
              private router: Router, private speechService: SpeechService) {

    events.subscribe('tab2:created', (time) => {
      // time is the same arguments passed in `events.publish(time)`
      console.log('Welcome to Tab2 ', 'at', time);
    });

    //this.startSpeechRecognition();
    
  }

  // 8/10/19 DH: Finding where image display delay occurs
  clickTab2() {
    console.log("Camera tab clicked: ");
  }

  // 4/2/22 DH: Adding mechanism to auto select "Addresses" tab when selecting tab4 (with Angular 8)
  clickTab4() {
    console.log("Google tab clicked: ");
    document.getElementById("tab-button-tab4google/tab4google/tab4").click();
  }

  // 13/10/19 DH: Increasing tab 2 gallery display time
  ngOnInit() {
    console.log("Loaded TabsPage");
    //this.tab2.presentToast();

    console.log("Loading photos in TabsPage...");
    this.photoService.loadSaved(this);
    console.log("Called 'photoService.loadSaved()' callback in TabsPage");
    this.logService.log("TabsPage called photoService.loadSaved()");

    // 31/1/22 DH:
    //this.startSpeechRecognition();
    //this.recordSpeech();
 
    // 24/11/20 DH: pre-load the gsheet data
    // 27/5/21 DH: and catch JSON google errors
    try {
      startSheets();
    } catch (e){
      console.log(e.name + ': ');
      console.log(e.message);
      //Tab1Page.templateUrl = 'tab1NODDY.page.html'; 
      // not able to alter dynamically, need new page..
      this.router.navigate(['/tabs/tab1/google-error', e.name, e.message]);
      return;
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

        this.router.navigate(['/tabs/tab1/google-error', "GoogleAuthError", 
                              "Error: " + JSON.stringify(JSONobj.response.data.error) + 
                              ", Error desc: " + JSON.stringify(JSONobj.response.data.error_description) + 
                              ", Code: " + JSON.stringify(JSONobj.code) ]);

        //console.log('googleapisErr: '+ googleapisErr );
        //console.log(JSONobj.response.data );
        //console.log(JSONobj.response.data.error );
        //console.log(JSONobj.response.data.error_description);

      }
    }
  }

  ngAfterViewInit() {
    //this.tab2.presentToast();
  }

  // 30/1/22 DH: =================== Speech recognition ======================
/*
  startSpeechRecognition(){
    // Check feature available
    this.speechRecognition.isRecognitionAvailable()
      //.then((available: boolean) => console.log(available));
      .then((available: boolean) => this.logService.log("TabsPage speech: " + available))
      .catch(error => this.logService.log("TabsPage speech: " + error));

    // Request permissions
    this.speechRecognition.requestPermission()
      .then(
        () => this.logService.log('Granted'),
        () => this.logService.log('Denied')
      );
  }

  recordSpeech(){
  // Start the recognition process (which stops on Android at "end of sentence" ie after sufficient length pause)
    this.speechRecognition.startListening()
    .subscribe(
      (matches: string[]) => this.logService.log(matches),
      (onerror) => this.logService.log('error:'+ onerror)
    );
  }
  */

  
}
