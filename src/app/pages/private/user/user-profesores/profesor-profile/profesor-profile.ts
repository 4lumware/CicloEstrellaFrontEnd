import {Component, computed, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TeacherService} from '../../../../../core/services/teachers/teachers-service';
import { TagService } from "../../../../../core/services/tags/tag-service";
import {ReviewService} from '../../../../../core/services/reviews/review-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {TeacherModel} from '../../../../../core/models/teachers/teacher';
import {
  CreateReviewRequest, ReactionCountModel,
  ReactionModel, ReactionSummary,
  ReviewModalData, ReviewModalResult,
  ReviewModel,
} from '../../../../../core/models/reviews/review';
import {TagModel} from '../../../../../core/models/tags/tags';
import {AuthCurrentUserService} from '../../../../../core/services/users/auth/auth-current-user-service';
import {ReviewModal} from '../../../../../shared/components/reviews/review-modal/review-modal';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatFormField} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {ReviewCard} from '../../../../../shared/components/reviews/review-card/review-card';
import {DecimalPipe} from '@angular/common';
import {ReactionService} from '../../../../../core/services/reactions/reaction-service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-profesor-profile',
  imports: [
    MatProgressSpinner,
    MatIconButton,
    MatIcon,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    ReviewCard,
    DecimalPipe
  ],
  templateUrl: './profesor-profile.html',
  styleUrl: './profesor-profile.css',
})
export class ProfesorProfile {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private teacherService = inject(TeacherService);
  private reviewService = inject(ReviewService);
  private tagService = inject(TagService);
  private reactionService = inject(ReactionService);
  private authService = inject(AuthCurrentUserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  teacher = signal<TeacherModel | null>(null);
  reviews = signal<ReviewModel[]>([]);
  allTags = signal<TagModel[]>([]);
  allReactions = signal<ReactionModel[]>([]);
  reviewReactions = signal<Map<number, ReactionCountModel[]>>(new Map());
  isLoading = signal<boolean>(true);
  isLoadingReviews = signal<boolean>(false);
  searchKeyword = signal<string>('');

  currentUserId = computed(() => this.authService.getCurrentUserId());
  teacherCampuses = computed(() => this.teacher()?.campuses || []);
  teacherCourses = computed(() => this.teacher()?.courses || []);

  topTags = computed(() => {
    const teacher = this.teacher();
    if (!teacher) return [];

    if (teacher.tags && teacher.tags.length > 0) {
      return teacher.tags.slice(0, 5);
    }

    const tagCounts = new Map<number, { tag: TagModel; count: number }>();

    this.reviews().forEach((review) => {
      review.tags.forEach((tag) => {
        const current = tagCounts.get(tag.id);
        if (current) {
          current.count++;
        } else {
          tagCounts.set(tag.id, { tag, count: 1 });
        }
      });
    });

    return Array.from(tagCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((item) => item.tag);
  });

  filteredReviews = computed(() => {
    const keyword = this.searchKeyword().toLowerCase().trim();
    if (!keyword) return this.reviews();

    return this.reviews().filter(
      (review) =>
        review.description.toLowerCase().includes(keyword) ||
        review.student.username.toLowerCase().includes(keyword) ||
        review.tags.some((tag) => tag.tagName.toLowerCase().includes(keyword))
    );
  });

  reviewStats = computed(() => {
    const reviews = this.reviews();
    if (reviews.length === 0) {
      return { total: 0, average: 0, distribution: [] };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / total;

    const distribution = Array.from({ length: 10 }, (_, i) => {
      const rating = i + 1;
      const count = reviews.filter((r) => Math.round(r.rating) === rating).length;
      const percentage = (count / total) * 100;
      return { rating, count, percentage };
    }).reverse();

    return { total, average, distribution };
  });

  ngOnInit() {
    const teacherId = Number(this.route.snapshot.paramMap.get('id'));
    if (teacherId) {
      this.loadTeacherProfile(teacherId);
      this.loadReviews(teacherId);
      this.loadAllTags();
      this.loadAllReactions();
    } else {
      this.router.navigate(['/private/profesores']);
    }
  }

  loadTeacherProfile(teacherId: number) {
    this.isLoading.set(true);
    this.teacherService.getById(teacherId).subscribe({
      next: (teacher) => {
        this.teacher.set(teacher);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading teacher:', err);
        this.snackBar.open('Error al cargar el perfil del profesor', 'Cerrar', {
          duration: 3000,
        });
        this.router.navigate(['/private/profesores']);
      },
    });
  }

  // ⭐ ACTUALIZADO: Convertir ReactionSummary a ReactionCountModel
  loadReviews(teacherId: number, keyword?: string) {
    console.log('🔄 Cargando reviews...');
    this.isLoadingReviews.set(true);

    this.reviewService.getReviewsByTeacher(teacherId, keyword).subscribe({
      next: (reviews) => {
        console.log('✅ Reviews recibidas:', reviews);

        if (reviews.length > 0) {
          console.log('📊 Primera review:', reviews[0]);
          console.log('📊 Reacciones raw:', reviews[0].reactions);
        }

        this.reviews.set(reviews);

        // ⭐ Construir mapa convirtiendo ReactionSummary a ReactionCountModel
        const map = new Map<number, ReactionCountModel[]>();
        reviews.forEach((review) => {
          if (review.reactions && Array.isArray(review.reactions)) {
            // Convertir cada reacción al formato correcto
            const convertedReactions: ReactionCountModel[] = (review.reactions as any[]).map((r: ReactionSummary) => ({
              reaction: {
                id: r.id,
                reactionName: r.reactionName,
                icon_url: r.icon_url,
              },
              count: r.count,
              userReacted: r.userReacted || false,
              userReactionId: r.userReactionId,
            }));

            console.log(`✅ Review ${review.id} convertida:`, convertedReactions);
            map.set(review.id, convertedReactions);
          } else {
            console.log(`📭 Review ${review.id} sin reacciones`);
            map.set(review.id, []);
          }
        });

        console.log('🗺️ Mapa de reacciones:', map);
        this.reviewReactions.set(map);
        this.isLoadingReviews.set(false);
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.isLoadingReviews.set(false);
      },
    });
  }

  loadAllTags() {
    this.tagService.getAllTags().subscribe({
      next: (tags) => {
        this.allTags.set(tags);
      },
      error: (err) => {
        console.error('Error loading tags:', err);
      },
    });
  }

  loadAllReactions() {
    console.log('🔄 Cargando reacciones disponibles...');
    this.reactionService.getAllReactions().subscribe({
      next: (reactions) => {
        console.log('✅ Reacciones disponibles:', reactions);
        this.allReactions.set(reactions);
      },
      error: (err) => {
        console.error('❌ Error cargando reacciones:', err);
      },
    });
  }

  handleReaction(event: {
    reviewId: number;
    reactionId: number;
    reviewReactionId?: number
  }) {
    const { reviewId, reactionId, reviewReactionId } = event;
    const teacher = this.teacher();
    if (!teacher) return;

    console.log('🎯 Evento de reacción:', event);

    if (reactionId === 0 && reviewReactionId) {
      // ELIMINAR
      this.reviewService.removeReaction(reviewId, reviewReactionId).subscribe({
        next: () => {
          console.log('✅ Reacción eliminada');
          this.snackBar.open('Reacción eliminada', 'Cerrar', { duration: 2000 });
          this.loadReviews(teacher.id);
        },
        error: (err) => {
          console.error('❌ Error:', err);
          this.snackBar.open('Error al eliminar reacción', 'Cerrar', {
            duration: 2000,
          });
        },
      });
    } else if (reviewReactionId) {
      // CAMBIAR
      this.reviewService.removeReaction(reviewId, reviewReactionId).subscribe({
        next: () => {
          this.reviewService.addReaction(reviewId, reactionId).subscribe({
            next: () => {
              console.log('✅ Reacción cambiada');
              this.snackBar.open('Reacción actualizada', 'Cerrar', {
                duration: 2000,
              });
              this.loadReviews(teacher.id);
            },
            error: (err) => {
              console.error('❌ Error:', err);
              this.loadReviews(teacher.id);
            },
          });
        },
        error: (err) => {
          console.error('❌ Error:', err);
          this.loadReviews(teacher.id);
        },
      });
    } else {
      // AGREGAR
      this.reviewService.addReaction(reviewId, reactionId).subscribe({
        next: () => {
          console.log('✅ Reacción agregada');
          this.snackBar.open('Reacción agregada', 'Cerrar', { duration: 2000 });
          this.loadReviews(teacher.id);
        },
        error: (err) => {
          console.error('❌ Error:', err);
          this.snackBar.open('Error al agregar reacción', 'Cerrar', {
            duration: 2000,
          });
        },
      });
    }
  }

  onSearchReviews() {
    const teacher = this.teacher();
    if (teacher) {
      this.loadReviews(teacher.id, this.searchKeyword());
    }
  }

  openReviewModal(review?: ReviewModel) {
    const teacher = this.teacher();
    if (!teacher) return;

    const dialogRef = this.dialog.open(ReviewModal, {
      width: '700px',
      maxWidth: '95vw',
      data: {
        teacherId: teacher.id,
        teacherName: `${teacher.firstName} ${teacher.lastName}`,
        review: review,
        availableTags: this.allTags(),
      } as ReviewModalData,
    });

    dialogRef.afterClosed().subscribe((result: ReviewModalResult) => {
      if (result) {
        if (review) {
          this.updateReview(review.id, result);
        } else {
          this.createReview(result);
        }
      }
    });
  }

  createReview(reviewData: ReviewModalResult) {
    const teacher = this.teacher();
    if (!teacher) return;

    const payload: CreateReviewRequest = {
      ...reviewData,
      teacherId: teacher.id,
    };

    this.reviewService.store(payload).subscribe({
      next: () => {
        this.snackBar.open('¡Reseña publicada exitosamente!', 'Cerrar', {
          duration: 3000,
        });
        this.loadReviews(teacher.id);
        this.loadTeacherProfile(teacher.id);
      },
      error: (err) => {
        console.error('Error creating review:', err);
        this.snackBar.open(
          err.error?.message || 'Error al publicar la reseña',
          'Cerrar',
          { duration: 3000 }
        );
      },
    });
  }

  updateReview(reviewId: number, reviewData: ReviewModalResult) {
    const teacher = this.teacher();
    if (!teacher) return;

    this.reviewService.update(reviewId, reviewData).subscribe({
      next: () => {
        this.snackBar.open('¡Reseña actualizada exitosamente!', 'Cerrar', {
          duration: 3000,
        });
        this.loadReviews(teacher.id);
      },
      error: (err) => {
        console.error('Error updating review:', err);
        this.snackBar.open('Error al actualizar la reseña', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  deleteReview(reviewId: number) {
    const teacher = this.teacher();
    if (!teacher) return;

    this.reviewService.destroy(reviewId).subscribe({
      next: () => {
        this.snackBar.open('Reseña eliminada', 'Cerrar', { duration: 2000 });
        this.loadReviews(teacher.id);
        this.loadTeacherProfile(teacher.id);
      },
      error: (err) => {
        console.error('Error deleting review:', err);
        this.snackBar.open('Error al eliminar la reseña', 'Cerrar', {
          duration: 2000,
        });
      },
    });
  }

  isOwnReview(review: ReviewModel): boolean {
    const userId = this.currentUserId();
    return userId !== null && review.student.id === userId;
  }

  goBack() {
    this.router.navigate(['/private/profesores']);
  }
}
