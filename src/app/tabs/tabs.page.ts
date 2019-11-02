import { Component, ViewChild } from '@angular/core';
import { PhotoService } from '../services/photo.service';

// 16/10/19 DH:
import { Events } from '@ionic/angular';

// 17/10/19 DH:
import { LogService } from '../services/log.service'

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

    // 17/10/19 DH: Msg not passed since this is parent class of Tab3 display list...!
    this.logService.log("TabsPage called photoService.loadSaved()");
  }

  ngAfterViewInit() {
    //this.tab2.presentToast();
  }

  
}
