import {Component, input, output} from '@angular/core';
import {CommentModel} from '../../../core/models/comments/comment';
import {MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-formality-comments',
  imports: [
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem
  ],
  templateUrl: './formality-comments.html',
  styleUrl: './formality-comments.css',
})
export class FormalityComments {
  comment = input.required<CommentModel>();
  isOwnComment = input<boolean>(false);

  onEdit = output<CommentModel>();
  onDelete = output<number>();

  editComment() {
    this.onEdit.emit(this.comment());
  }

  deleteComment() {
    if (confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      this.onDelete.emit(this.comment().id);
    }
  }

  formatDate(date: Date): string {
    const commentDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - commentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;

    return commentDate.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
