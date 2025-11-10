import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from '../../../../components/chatbot/chatbot.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';

@Component({
  selector: 'app-formality',
  imports: [CommonModule, ChatbotComponent, MatIconModule, MatMiniFabButton],
  templateUrl: './formality.html',
  styleUrl: './formality.css',
})
export class Formality {
  chatbotVisible = false;
  userInput = '';
  suggestions = ['Consultar profesores', 'Ver biblioteca', 'Trámites académicos'];

  toggleChatbot() {
    this.chatbotVisible = !this.chatbotVisible;
  }
}
