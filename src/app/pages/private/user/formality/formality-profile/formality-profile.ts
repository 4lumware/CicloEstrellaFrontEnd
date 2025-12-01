import {Component, computed, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FormalityService } from "../../../../../core/services/formalities/formality-service";
import { AuthCurrentUserService } from "../../../../../core/services/users/auth/auth-current-user-service";
import {CommentService} from '../../../../../core/services/comments/comment-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormalityModel} from '../../../../../core/models/formalities/formality';
import {CommentCreateModel, CommentModel} from '../../../../../core/models/comments/comment';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatHint} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {FormalityComments} from '../../../../../shared/components/formality-comments/formality-comments';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-formality-profile',
  imports: [
    MatProgressSpinner,
    MatIconButton,
    MatIcon,
    MatButton,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInput,
    MatHint,
    FormalityComments,
    DatePipe
  ],
  templateUrl: './formality-profile.html',
  styleUrl: './formality-profile.css',
})
export class FormalityProfile {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formalityService = inject(FormalityService);
  private commentService = inject(CommentService);
  private authService = inject(AuthCurrentUserService);
  private snackBar = inject(MatSnackBar);

  formality = signal<FormalityModel | null>(null);
  comments = signal<CommentModel[]>([]);
  isLoading = signal<boolean>(true);
  isLoadingComments = signal<boolean>(false);
  searchKeyword = signal<string>('');

  // Estado del formulario de comentario
  showCommentForm = signal<boolean>(false);
  commentText = signal<string>('');
  editingComment = signal<CommentModel | null>(null);
  maxCommentLength = 150;

  currentUserId = computed(() => this.authService.getCurrentUserId());

  filteredComments = computed(() => {
    const keyword = this.searchKeyword().toLowerCase().trim();
    if (!keyword) return this.comments();

    return this.comments().filter(
      (comment) =>
        comment.text.toLowerCase().includes(keyword) ||
        comment.author.username.toLowerCase().includes(keyword)
    );
  });

  remainingChars = computed(() => {
    return this.maxCommentLength - this.commentText().length;
  });

  ngOnInit() {
    const formalityId = Number(this.route.snapshot.paramMap.get('id'));
    if (formalityId) {
      this.loadFormalityProfile(formalityId);
      this.loadComments(formalityId);
    } else {
      this.router.navigate(['/private/tramites']);
    }
  }

  loadFormalityProfile(formalityId: number) {
    this.isLoading.set(true);
    this.formalityService.getById(formalityId).subscribe({
      next: (formality) => {
        this.formality.set(formality);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading formality:', err);
        this.snackBar.open('Error al cargar el trámite', 'Cerrar', {
          duration: 3000,
        });
        this.router.navigate(['/private/tramites']);
      },
    });
  }

  loadComments(formalityId: number) {
    console.log('🔵 Iniciando carga de comentarios para formality ID:', formalityId);

    this.isLoadingComments.set(true);

    this.commentService.getCommentsByFormality(formalityId).subscribe({
      next: (comments) => {
        console.log('✅ Comentarios recibidos exitosamente:', comments);
        console.log('📊 Cantidad de comentarios:', comments.length);

        if (comments.length > 0) {
          console.log('📝 Primer comentario:', comments[0]);
          console.log('📝 Tipo de text:', typeof comments[0]?.text);
          console.log('📝 Valor de text:', comments[0]?.text);
        }

        this.comments.set(comments);
        this.isLoadingComments.set(false);
      },
      error: (err) => {
        console.error('❌ ERROR al cargar comentarios:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ Message:', err.message);
        console.error('❌ Error completo:', err);

        this.isLoadingComments.set(false);

        // Mostrar snackbar con el error
        this.snackBar.open(
          `Error al cargar comentarios: ${err.message || 'Error desconocido'}`,
          'Cerrar',
          { duration: 5000 }
        );
      },
      complete: () => {
        console.log('🏁 Carga de comentarios completada');
      }
    });
  }


  onSearchComments() {
    // El filtrado se hace automáticamente con el computed
  }

  toggleCommentForm() {
    this.showCommentForm.set(!this.showCommentForm());
    if (!this.showCommentForm()) {
      this.cancelComment();
    }
  }

  openEditComment(comment: CommentModel) {
    this.editingComment.set(comment);
    this.commentText.set(comment.text);
    this.showCommentForm.set(true);
  }

  cancelComment() {
    this.commentText.set('');
    this.editingComment.set(null);
    this.showCommentForm.set(false);
  }

  publishComment() {
    const formality = this.formality();
    if (!formality) return;

    const text = this.commentText().trim();
    if (!text) {
      this.snackBar.open('El comentario no puede estar vacío', 'Cerrar', {
        duration: 2000,
      });
      return;
    }

    if (text.length > this.maxCommentLength) {
      this.snackBar.open(
        `El comentario no puede exceder ${this.maxCommentLength} caracteres`,
        'Cerrar',
        { duration: 2000 }
      );
      return;
    }

    const commentData: CommentCreateModel = { text };

    const editingComment = this.editingComment();
    if (editingComment) {
      // Actualizar
      this.commentService
        .update(commentData, formality.idFormality, editingComment.id)
        .subscribe({
          next: () => {
            this.snackBar.open('Comentario actualizado', 'Cerrar', {
              duration: 2000,
            });
            this.loadComments(formality.idFormality);
            this.cancelComment();
          },
          error: (err) => {
            console.error('Error updating comment:', err);
            this.snackBar.open('Error al actualizar el comentario', 'Cerrar', {
              duration: 2000,
            });
          },
        });
    } else {
      // Crear
      this.commentService.store(commentData, formality.idFormality).subscribe({
        next: () => {
          this.snackBar.open('Comentario publicado', 'Cerrar', {
            duration: 2000,
          });
          this.loadComments(formality.idFormality);
          this.cancelComment();
        },
        error: (err) => {
          console.error('Error creating comment:', err);
          this.snackBar.open('Error al publicar el comentario', 'Cerrar', {
            duration: 2000,
          });
        },
      });
    }
  }

  deleteComment(commentId: number) {
    const formality = this.formality();
    if (!formality) return;

    this.commentService.destroy(formality.idFormality, commentId).subscribe({
      next: () => {
        this.snackBar.open('Comentario eliminado', 'Cerrar', { duration: 2000 });
        this.loadComments(formality.idFormality);
      },
      error: (err) => {
        console.error('Error deleting comment:', err);
        this.snackBar.open('Error al eliminar el comentario', 'Cerrar', {
          duration: 2000,
        });
      },
    });
  }

  isOwnComment(comment: CommentModel): boolean {
    const userId = this.currentUserId();
    return userId !== null && comment.author.id === userId;
  }

  goBack() {
    this.router.navigate(['/private/tramites']);
  }

  getDaysRemaining(): number {
    const formality = this.formality();
    if (!formality) return 0;

    const today = new Date();
    const end = new Date(formality.endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  isExpiringSoon(): boolean {
    const days = this.getDaysRemaining();
    return days <= 7 && days > 0;
  }

  isExpired(): boolean {
    return this.getDaysRemaining() < 0;
  }
}
