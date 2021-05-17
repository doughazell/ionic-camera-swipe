import { Component, ViewChild } from '@angular/core';
import { PhotoService } from '../services/photo.service';

// 16/10/19 DH:
import { Events } from '@ionic/angular';

// 17/10/19 DH:
import { LogService } from '../services/log.service'

// 24/11/20 DH: Like pre-loading images for Tab2, I'm attempting to pre-load the gsheet data
const { startSheets, getRows, rows } = require('../../assets/gsheet');

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})

export class TabsPage {

  constructor(public photoService: PhotoService, public events: Events, public logService: LogService) {

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
    startSheets();    
  }

  ngAfterViewInit() {
    //this.tab2.presentToast();
  }

  
}
