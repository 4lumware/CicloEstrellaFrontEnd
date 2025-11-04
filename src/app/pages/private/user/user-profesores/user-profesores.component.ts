import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroComponent } from '../../../../layout/private/user/authenticated-user-filter-profesores/authenticated-user-filter-profesores';
import { ChatbotComponent } from '../../../../components/chatbot/chatbot.component';

@Component({
  selector: 'app-user-profesores',
  templateUrl: './user-profesores.component.html',
  styleUrls: ['./user-profesores.component.css'],
  imports: [FiltroComponent, CommonModule, FormsModule, ChatbotComponent],
})
export class UserProfesoresComponent implements OnInit {
  searchQuery: string = '';
  userInput = '';
  chatbotVisible = false;
  showFiltro: boolean = false;

  profesores = [
    {
      facultad: 'Profesores Destacados de Ingeniería de Software',
      items: [
        {
          nombre: 'Jose Ventura',
          facultad: 'Ingeniería',
          calificacion: '7.6',
          imagen: 'images/ventura.png',
        },
        {
          nombre: 'Alejandro Alonso',
          facultad: 'Ingeniería',
          calificacion: '7.4',
          imagen: 'images/alejandroalonso.png',
        },
        {
          nombre: 'Juan Alonso',
          facultad: 'Ingeniería',
          calificacion: '6.6',
          imagen: 'images/juanalonso.png',
        },
      ],
    },
    {
      facultad: 'Profesores Destacados de Pregrado',
      items: [
        {
          nombre: 'Maria Chi',
          facultad: 'Comunicación',
          calificacion: '7.6',
          imagen: 'images/mariachi.png',
        },
        {
          nombre: 'Juan Roman',
          facultad: 'Ingeniería',
          calificacion: '7.6',
          imagen: 'images/juanroman.png',
        },
        {
          nombre: 'Nedin Sanchez',
          facultad: 'Ingeniería',
          calificacion: '7.6',
          imagen: 'images/nedinsanchez.png',
        },
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  search() {
    console.log('Buscando: ', this.searchQuery);
  }

  toggleFiltro() {
    this.showFiltro = !this.showFiltro;
  }

  addToProfile(profesor: any) {
    console.log('Añadir al perfil: ', profesor);
  }

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
