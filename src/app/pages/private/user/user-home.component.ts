import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatbotComponent } from '../../../shared/components/chatbot/chatbot.component';

@Component({
  selector: 'app-user-home',
  imports: [ChatbotComponent, RouterLink],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css',
})
export class UserHomeComponent {
  title = 'CicloEstrellaFrontend';
  chatbotVisible = false;
  userInput = '';
  suggestions = ['Consultar profesores', 'Ver biblioteca', 'Trámites académicos'];

  // Muestra u oculta el chatbot
  toggleChatbot() {
    this.chatbotVisible = !this.chatbotVisible;
  }

  // Redirige a la sección correspondiente (puedes usar Router más adelante)
  goTo(section: string) {
    console.log(`Ir a sección: ${section}`);
  }

  // Envía el mensaje del usuario
  sendMessage() {
    if (this.userInput.trim()) {
      console.log(`Mensaje enviado: ${this.userInput}`);
      this.userInput = '';
    }
  }
}
