import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from './message.model';

type SenderShape = string | { id?: string | null } | null;

interface MessageDto {
  id: string;
  subject: string;
  msgText: string;
  sender: SenderShape;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];
  private messagesUrl = 'http://localhost:3000/messages';

  constructor(private http: HttpClient) {
    this.messages = [];
    this.fetchMessages();
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }

  refreshMessages(): void {
    this.fetchMessages();
  }

  private fetchMessages() {
    this.http
      .get<{ message: string; messages: MessageDto[] }>(this.messagesUrl)
      .subscribe(
      (responseData) => {
        this.messages = (responseData.messages || []).map((msg) => this.toMessage(msg));
        this.messages.sort((a: Message, b: Message) =>
          parseInt(b.id, 10) - parseInt(a.id, 10),
        );
        this.messageChangedEvent.emit(this.messages.slice());
      },
      (error: any) => {
        console.error('Error fetching messages:', error);
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

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    message.id = '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http
      .post<{ message: string; messageObject: MessageDto }>(
        this.messagesUrl,
        message,
        { headers: headers },
      )
      .subscribe((responseData) => {
        this.messages.unshift(this.toMessage(responseData.messageObject));
        this.messageChangedEvent.emit(this.messages.slice());
      });
  }

  private toMessage(message: MessageDto): Message {
    let sender = '';

    if (typeof message.sender === 'string') {
      sender = message.sender;
    } else if (message.sender && message.sender.id) {
      sender = message.sender.id;
    }

    return new Message(message.id, message.subject, message.msgText, sender);
  }
}

