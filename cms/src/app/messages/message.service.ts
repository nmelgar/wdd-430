import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from './message.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];
  maxMessageId = 0;
  private firebaseUrl = environment.firebaseUrl + '/messages.json';

  constructor(private http: HttpClient) {
    this.messages = [];
    this.fetchMessages();
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }

  refreshMessages(): void {
    console.log('Refreshing messages from Firebase');
    this.fetchMessages();
  }

  private fetchMessages() {
    console.log('Fetching messages from:', this.firebaseUrl);
    this.http.get<Message[]>(this.firebaseUrl).subscribe(
      (messages: Message[]) => {
        console.log('Messages fetched:', messages);
        this.messages = messages || [];
        this.maxMessageId = this.getMaxId();
        this.messages.sort((a: Message, b: Message) =>
          parseInt(b.id, 10) - parseInt(a.id, 10),
        );
        this.messageChangedEvent.emit(this.messages.slice());
      },
      (error: any) => {
        console.error('Error fetching messages:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
      },
    );
  }

  getMessage(id: string): Message | null {
    for (const message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }

    return null;
  }

  getMaxId(): number {
    let maxId = 0;

    for (const message of this.messages) {
      const currentId = parseInt(message.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addMessage(message: Message) {
    this.maxMessageId++;
    message.id = this.maxMessageId.toString();
    this.messages.push(message);
    this.storeMessages();
  }

  storeMessages() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    console.log('Storing messages to Firebase:', this.messages);
    this.http.put(this.firebaseUrl, this.messages, { headers }).subscribe(
      () => {
        console.log('Messages stored successfully');
        this.messageChangedEvent.emit(this.messages.slice());
        console.log('MessageChangedEvent emitted');
      },
      (error: any) => {
        console.error('Error storing messages:', error);
      },
    );
  }
}

