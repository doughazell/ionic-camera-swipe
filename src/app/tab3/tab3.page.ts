import { Component } from '@angular/core';

// 17/10/19 DH:
import { LogService } from '../services/log.service'

// 3/2/22 DH:
import { SpeechService, ParsedSpeech } from '../services/speech.service';

// 3/5/22 DH:
import { SelectionComponent } from './selection/selection.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  private items = [
    'Tab3 default item: Nice work, good job!',
    'Tab3 default item: Hey, sweeet.'
  ];

  constructor(public logService: LogService, private speechService: SpeechService,
              private modalCtrl: ModalController ) {
    this.logService.setTab3Page(this);
  }

  ngOnInit() {
    //console.log("Yup we're off the ground...again");
    //this.logService.log("Tab3Page init'd.");
    this.logService.flushBuffer();
  }
  
  itemSelected(item: string, index: number) {
    console.log("Selected Item (", index, "): ", item);
    this.items.splice(index,1);
    // 30/4/22 DH: Send deleted item string to SpeechService to build up modal for action
    this.speechService.populateModal(item);
  }

  deleteItem(item: string, index: number){
    console.log("Delete Item (", index, "): ", item);
    this.items.splice(index,1);
    // 30/4/22 DH: Send deleted item string to SpeechService to build up modal for action
    this.speechService.populateModal(item);
  }

  displayMsg(item: string) {
    //this.items.push(item);
    this.items.unshift(item);
  }

  recordSpeech(){
    
    let res = this.speechService.recordSpeech();
    
    // 3/5/22 DH:
    if (res == "Speech not available"){
      this.logService.log("Happy days..." + res);
      // 3/5/22 DH: Added to dev Modal via 'ionic serve' where Smartphone speech is not available
      //            (which then gets used via 'useSelection() below)

      let parsedSpeech: ParsedSpeech = {action: "need", objects: [] };
      if (parsedSpeech.objects){
        parsedSpeech.objects.push("long", "bungee");
      }

      this.speechService.createUsedSpeech(parsedSpeech);
    }
    //this.logService.log("FFS...: "+ res);
  }

  // 30/4/22 DH:
  clearLog(){
    this.items = [];
  }

  // 2/5/22 DH: https://github.com/saimon24/ioniconf-routing-example/blob/master/src/app/pages/my-modal/my-modal.page.ts
  //            https://www.youtube.com/watch?v=SaotQDK3Neo&t=3s
  async useSelection(){
    let parsedSpeech: ParsedSpeech = this.speechService.useSelection();

    // 3/5/22 DH: Without 'await' on 'create()' then use get:
    // "Property 'present' does not exist on type 'Promise<>'. Did you forget to use 'await'?"
    //const modal = this.modalCtrl.create({
    
    const modal = await this.modalCtrl.create({
      component: SelectionComponent,
      componentProps: {
        action: parsedSpeech.action,
        objects: parsedSpeech.objects.toString()
      }
    });
    
    // 3/5/22 DH: No need for 'await' here as shown by "Ionic Components: Modals" Youtube
    modal.present();
    
    /*
    modal.onDidDismiss()
      //.then( res => alert(JSON.stringify(res)) );
      
      // 5/5/22 DH: a bit of determinism cf. the Emily Wheel...!
      .then( res => res.data && alert(res.data.toString() ) );
    */
  }

}
