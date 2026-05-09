import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';

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

  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender = 'Nefi';

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

    this.addMessageEvent.emit(newMessage);
    this.onClear();
  }

  onClear() {
    this.subjectInput.nativeElement.value = '';
    this.msgTextInput.nativeElement.value = '';
  }
}
