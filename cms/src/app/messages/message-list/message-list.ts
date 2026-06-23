import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../message.model';
import { MessageItem } from '../message-item/message-item';
import { MessageEdit } from '../message-edit/message-edit';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  standalone: true,
  imports: [CommonModule, MessageItem, MessageEdit],
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList implements OnInit {
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    console.log('MessageList ngOnInit started');
    
    this.messageService.refreshMessages();
    
    this.messages = this.messageService.getMessages();
    console.log('Initial messages from service:', this.messages);
    
    this.messageService.messageChangedEvent.subscribe((messages: Message[]) => {
      console.log('MessageChangedEvent received with messages:', messages);
      this.messages = messages;
    });
  }
}
