import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../message.model';
import { MessageItem } from '../message-item/message-item';
import { MessageEdit } from '../message-edit/message-edit';

@Component({
  selector: 'cms-message-list',
  standalone: true,
  imports: [CommonModule, MessageItem, MessageEdit],
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList {
  messages: Message[] = [
    new Message('1', 'Grades', 'The grades for this assignment have been posted', 'Bro Jackson'),
    new Message('2', 'Assignment 3', 'When is assignment 3 due.', 'Steve Johnson'),
    new Message('3', 'Meeting', 'Can I meet with you sometime', 'Mark Smith'),
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
