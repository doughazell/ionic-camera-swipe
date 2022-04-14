// 3/2/22 DH:
import { Injectable } from '@angular/core';
import { LogService } from './log.service';
import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';
// 3/2/22 DH: Attempting to easily update <ion-list> from recordSpeech() after button callback returned
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
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

  recordSpeech(){
  // Start the recognition process (which stops on Android at "end of sentence" ie after sufficient length pause)
    this.speechRecognition.startListening()
    .subscribe(
      (matches: string[]) => {
        this.logService.log(matches);
        // 3/2/22 DH: 'Tab3Page.recordSpeech()' callback will have already returned and hence 
        //            not triggering an Angular update to <ion-list>
        //this.router.navigate(['/tabs/tab2']); // shows updated list before changing page...so we're close...
        document.getElementById("tab-button-tab3").click();
      },
      (onerror) => this.logService.log('error:'+ onerror)
    );
  }
}