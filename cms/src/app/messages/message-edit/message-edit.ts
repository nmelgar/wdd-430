import { Component, ElementRef, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  standalone: true,
  imports: [],
  templateUrl: './message-edit.html',
  styleUrl: './message-edit.css',
})
export class MessageEdit {
  @ViewChild('subject', { static: false }) subjectInput!: ElementRef<HTMLInputElement>;
  @ViewChild('msgText', { static: false }) msgTextInput!: ElementRef<HTMLInputElement>;

  currentSender = '7';

  constructor(private messageService: MessageService) {}

  onSendMessage() {
    const subject = this.subjectInput.nativeElement.value;
    const msgText = this.msgTextInput.nativeElement.value;

    if (!subject.trim() || !msgText.trim()) {
      return;
    }

    const newMessage = new Message(
      Date.now().toString(),
      subject,
      msgText,
      this.currentSender,
    );

    this.messageService.addMessage(newMessage);
    this.onClear();
  }

  onClear() {
    this.subjectInput.nativeElement.value = '';
    this.msgTextInput.nativeElement.value = '';
  }
}
