import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  @Input() visible = false;
  userInput = '';
  suggestions = ['Consultar profesores', 'Ver biblioteca', 'Trámites académicos'];

  sendMessage() {
    if (this.userInput.trim()) {
      console.log(`Mensaje enviado: ${this.userInput}`);
      this.userInput = '';
    }
  }

  selectSuggestion(s: string) {
    console.log(`Seleccionado: ${s}`);
  }
}

