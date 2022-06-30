// 3/2/22 DH:
import { Injectable } from '@angular/core';
import { LogService } from './log.service';
import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';
// 3/2/22 DH: Attempting to easily update <ion-list> from recordSpeech() after button callback returned
import { Router } from '@angular/router';

// 29/4/22 DH: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#object-types
// (...so is an interface a named Object Type...???)
export interface ParsedSpeech {
  action: string;
  objects: string[];
};


@Injectable({
  providedIn: 'root'
})

export class SpeechService {
  // 28/4/22 DH: https://betterprogramming.pub/typescripts-record-type-explained-691372b1a449
  // private parsedSpeech: Record<string, string[]>[] = [];

  // 29/4/22 DH:
  private parsedSpeech: ParsedSpeech[] = [];
  // 30/4/22 DH:
  private usedSpeech: ParsedSpeech;

  constructor(private logService: LogService, private speechRecognition: SpeechRecognition,
              private router: Router) {
    this.startSpeechRecognition();
  }

  startSpeechRecognition(){
    // Check feature available
    this.speechRecognition.isRecognitionAvailable()
      //.then((available: boolean) => console.log(available));
      .then((available: boolean) => this.logService.log("SpeechService speech: " + available))
      .catch(error => this.logService.log("SpeechService speech: " + error));

    // Request permissions
    this.speechRecognition.requestPermission()
      .then(
        () => this.logService.log('Granted'),
        () => this.logService.log('Denied')
      );
  }

  addObjectsToAction(newRecord: ParsedSpeech){
    // 29/4/22 DH: Firstly check whether an entry already exists with 'newRecord.action'
    let record: ParsedSpeech;

    if ( (record = this.parsedSpeech.find(element => element.action == newRecord.action) ) == undefined){
      this.parsedSpeech.push(newRecord);
      //this.logService.log('Key: ' + newRecord.action + ', Value: ' + newRecord.objects.toString());
    } else {
      record.objects = record.objects.concat(newRecord.objects);
      //this.logService.log('Key: ' + record.action + ', Value: ' + record.objects.toString());
    }
    
  }

  displayActionObjects(){
    this.parsedSpeech.forEach((action) => {
      this.logService.log("ACTION: " + action.action);
      //this.logService.log(action.objects.toString() );
      action.objects.forEach((object) => {
        this.logService.log("OBJECT: " + object.toString() );
      });
    });
  }

  // 3/5/22 DH: Called from Tab3Page 'itemSelected()' or 'deleteItem()'
  populateModal(item: string){
    //this.logService.log("SpeechService.populateModal");

    let itemparts = item.split(':');
    //let key = subparts.pop(); // end of sentence
    //let key = subparts.shift();
    let word = itemparts[1];

    if(item.startsWith("ACTION")){
      
      // 30/4/22 DH: Debug
      //this.logService.log("--- ACTION ---");
      //this.logService.log(item);
      
      // 1/5/22 DH: interface instantiation 
      //            https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces
      this.usedSpeech = {action: word, objects: [] };
      this.logService.log(this.usedSpeech.action.toString() );

    } else {
      
      // 30/4/22 DH: Debug
      //this.logService.log("--- OBJECT ---");
      //this.logService.log(item);

      if (this.usedSpeech.objects) {
        this.usedSpeech.objects.push(word);
        this.logService.log(this.usedSpeech.objects.toString() );  
      }

    }

    //this.logService.log("END: SpeechService.populateModal");

  }

  // 3/5/22 DH:
  createUsedSpeech(usedSpeech){
    this.usedSpeech = usedSpeech;
  }

  // 1/5/22 DH: This is where the modal is created and presented 
  //       ( 'tab3.page.html' Button -> 'Tab3Page.useSelection()' -> 'SpeechService.useSelection()' )
  //
  // (currently in dev it is just being displayed on a clean log)
  useSelection(): ParsedSpeech {
    // 1/5/22 DH: ---------------- Dev -----------------------
    this.logService.clearLog();

    this.logService.log(this.usedSpeech.action);
    this.logService.log(this.usedSpeech.objects.toString() );
    
    this.logService.clickTab3();
    // -------------------------------------------------------
    return this.usedSpeech;
  }

  // 28/4/22 DH: Allowing user to select parts of speech recognition wanted to populate dialogue
  // (eventually speech recognition will be sufficient without further user input)
  parseReturn(retStr: string[]){
    //this.logService.log("Number of parts: "+retStr.length);

    // === List of returned probable recognised matches for sentence ===
    retStr.forEach((part) => {
      //this.logService.log(part);

      // 28/4/22 DH: Parsing EACH suggested speech recognition on whitespace
      let subparts = part.split(' ');
      //let key = subparts.pop(); // end of sentence
      let key = subparts.shift();
      
      let valueArray: string[] = [];

      // === List of words from each match ===
      subparts.forEach((subpart) => {
        valueArray.push(subpart);
      });

      // private parsedSpeech: Record<string, string[]>[] = [];
      //let newRecord = {key,valueArray};
      let newRecord: ParsedSpeech = {action: key, objects: valueArray};
      
      // 29/4/22 DH: Now add the specified 'objects' to a new 'action', if not already present
      this.addObjectsToAction(newRecord);
    });
    
    this.displayActionObjects();
  }

  recordSpeech(): string {
    let ret = "OK";

    // Start the recognition process (which stops on Android at "end of sentence" ie after sufficient length pause)
    this.speechRecognition.startListening()
    .subscribe(
      (matches: string[]) => {
        // 28/4/22 DH: We need to parse the "returned" comma separated string to populate the swipe dialog
        this.logService.log(matches);
        this.parseReturn(matches);

        // 3/2/22 DH: 'Tab3Page.recordSpeech()' callback will have already returned and hence 
        //            not triggering an Angular update to <ion-list>
        //this.router.navigate(['/tabs/tab2']); // shows updated list before changing page...so we're close...
        
        this.logService.clickTab3();
      },
      (onerror) => {
        this.logService.log('error:'+ onerror);
        ret = "Speech not available";
      }
    );

    return ret;
  }
}