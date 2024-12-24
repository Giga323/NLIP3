import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  getAbstractOfText(files: FileList, method: string): Observable<any> | null {
    const formData: FormData = new FormData()

    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    if (method === 'sentence extraction') {
      return this.http.post<any>(`http://localhost:3000/document/post`, formData)
    } else if (method === 'neurolink') {
      return this.http.post<any>(`http://localhost:8080/chat-bot/send-message`, formData) 
    } else {
      return null
    }
  }
}
