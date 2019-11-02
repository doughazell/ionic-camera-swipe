import { Component } from '@angular/core';
// 24/10/19 DH: Dynamic CSS variables
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  items = [
    { text: "First green item", colour: '#00ff00' },
    { text: "Second red item", colour: '#ff0000' },
    { text: "Third blue item", colour: '#0000ff' },
  ];

  constructor(private sanitizer: DomSanitizer) {}

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

}
