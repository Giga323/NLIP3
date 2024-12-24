import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { Abstract } from './interfaces/abstractInterface';
import e from 'cors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly methods: string[] = ['sentence extraction', 'neurolink']
  title = '3lab-front';
  info: any = ''
  files!: FileList
  abstract: any = {
    sentenceExtraction: [],
    keywordsExtraction: []
  };
  isMenuOpen: boolean = false;
  chosenMethod: string = 'sentence extraction'

  constructor(
    private apiService: ApiService
  ) { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  chooseMethod(method: string) {
    this.chosenMethod = method
  }

  onFilesSelected(event: Event) {
    const inputFiles = event.target as HTMLInputElement;

    if (inputFiles.files) {
      this.files = inputFiles.files
    }
  }

  getAbstractOfTheText(files: FileList): any {
    this.apiService.getAbstractOfText(files!, this.chosenMethod)!.subscribe(response => { 
      this.abstract.sentenceExtraction = response["sentenceExtraction"]
      this.abstract.keywordsExtraction = response["keywordsExtraction"]
    })
  }
}
