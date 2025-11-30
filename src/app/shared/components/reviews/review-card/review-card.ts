  import {Component, computed, input, output} from '@angular/core';
  import {
  ReactionCountModel,
  ReactionEvent,
  ReactionModel,
  ReviewModel,
} from '../../../../core/models/reviews/review';
  import {MatIcon} from '@angular/material/icon';
  import {MatButton, MatIconButton} from '@angular/material/button';
  import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
  import {MatTooltip} from '@angular/material/tooltip';
  import {MatDivider} from '@angular/material/divider';
  import {getReactionEmoji} from '../../../../core/constants/reaction-emojis';

  @Component({
    selector: 'app-review-card',
    imports: [
      MatIcon,
      MatIconButton,
      MatMenuTrigger,
      MatMenu,
      MatMenuItem,
      MatTooltip,
      MatDivider,
      MatButton
    ],
    templateUrl: './review-card.html',
    styleUrl: './review-card.css',
  })
  export class ReviewCard {
    review = input.required<ReviewModel>();
    isOwnReview = input<boolean>(false);
    currentUserId = input<number | null>(null);
    availableReactions = input<ReactionModel[]>([]);
    reviewReactions = input<ReactionCountModel[]>([]);

    onEdit = output<ReviewModel>();
    onDelete = output<number>();
    onReaction = output<ReactionEvent>();

    userReaction = computed(() => {
      const reactions = this.reviewReactions();
      const userReacted = reactions.find((rc) => rc.userReacted);

      if (userReacted) {
        return {
          reactionId: userReacted.reaction.id,
          userReactionId: userReacted.userReactionId,
          reaction: userReacted.reaction,
        };
      }

      return null;
    });

    reactionCounts = computed(() => {
      return this.reviewReactions();
    });

    editReview() {
      this.onEdit.emit(this.review());
    }

    deleteReview() {
      if (confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
        this.onDelete.emit(this.review().id);
      }
    }

    selectReaction(reactionId: number) {
      const currentReaction = this.userReaction();

      console.log('🎯 selectReaction:', { reactionId, currentReaction });

      if (currentReaction && currentReaction.reactionId === reactionId) {
        console.log('⚠️ Ya tiene esta reacción');
        return;
      }

      this.onReaction.emit({
        reviewId: this.review().id,
        reactionId: reactionId,
        reviewReactionId: currentReaction?.userReactionId,
      });
    }

    removeReaction() {
      const currentReaction = this.userReaction();
      if (!currentReaction || !currentReaction.userReactionId) return;

      this.onReaction.emit({
        reviewId: this.review().id,
        reactionId: 0,
        reviewReactionId: currentReaction.userReactionId,
      });
    }

    isUserReaction(reactionId: number): boolean {
      const userReaction = this.userReaction();
      return userReaction?.reactionId === reactionId;
    }

    // ⭐ NUEVO: Obtener emoji para una reacción
    getEmoji(reactionName: string): string {
      return getReactionEmoji(reactionName);
    }

    formatDate(date: Date): string {
      const reviewDate = new Date(date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Hoy';
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} días`;
      if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
      if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;

      return reviewDate.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    formatRating(rating: number): string {
      return rating.toFixed(1);
    }
  }
