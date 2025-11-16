import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { ChatbotComponent } from '../../../../shared/components/chatbot/chatbot.component';

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
