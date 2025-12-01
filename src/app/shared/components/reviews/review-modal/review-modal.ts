import {Component, computed, inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ReviewModalData, ReviewModalResult} from '../../../../core/models/reviews/review';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatSlider, MatSliderThumb} from '@angular/material/slider';
import {MatFormField, MatHint} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-review-modal',
  imports: [
    MatIcon,
    MatIconButton,
    MatSlider,
    MatSliderThumb,
    MatFormField,
    MatLabel,
    FormsModule,
    MatHint,
    MatInput,
    MatButton
  ],
  templateUrl: './review-modal.html',
  styleUrl: './review-modal.css',
})
export class ReviewModal {
  private dialogRef = inject(MatDialogRef<ReviewModal>);
  public data = inject<ReviewModalData>(MAT_DIALOG_DATA);

  // ⭐ CAMBIO: Ahora el rating interno es de 0-100 (para mostrar 0.0-10.0)
  protected internalRating = signal<number>(5.0); // 100 = 10.0

  // Rating mostrado (0.0 - 10.0)
  rating = computed(() => this.internalRating().toFixed(1));

  // Rating real para enviar al backend (0.00 - 9.99)
  actualRating = computed(() => {
    const value = this.internalRating();
    return value === 10 ? 9.99 : value; // ⭐ Si es 10, enviar 9.99
  });

  description = signal<string>('');
  selectedTags = signal<number[]>([]);
  searchQuery = signal<string>('');
  isEditMode = signal<boolean>(false);

  // Tags filtrados
  filteredTags = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.data.availableTags;
    return this.data.availableTags.filter((tag) =>
      tag.tagName.toLowerCase().includes(query)
    );
  });

  selectedCount = computed(() => this.selectedTags().length);

  constructor() {
    if (this.data.review) {
      this.isEditMode.set(true);
      // Convertir rating del backend (0.00-9.99) a escala interna (0-100)
      this.internalRating.set(Math.round(this.data.review.rating * 10));
      this.description.set(this.data.review.description);
      this.selectedTags.set(this.data.review.tags.map((t) => t.id));
    }
  }

  // ⭐ Actualizar rating desde el slider (0-100)
  onRatingChange(value: number | null) {
    if (value !== null) {
      this.internalRating.set(Number(value.toFixed(1)));
    }
  }

  toggleTag(tagId: number) {
    const current = this.selectedTags();
    if (current.includes(tagId)) {
      this.selectedTags.set(current.filter((id) => id !== tagId));
    } else {
      this.selectedTags.set([...current, tagId]);
    }
  }

  isTagSelected(tagId: number): boolean {
    return this.selectedTags().includes(tagId);
  }

  isValid(): boolean {
    return (
      this.description().trim().length > 0 &&
      this.selectedTags().length > 0 &&
      this.actualRating() >= 0 &&
      this.actualRating() <= 9.99
    );
  }

  save() {
    if (!this.isValid()) {
      console.warn('⚠️ Formulario inválido');
      return;
    }

    // ⭐ QUITAR teacherId de aquí
    const result: ReviewModalResult = {
      description: this.description().trim(),
      rating: this.actualRating(),
      tagIds: this.selectedTags(),
      // ❌ NO INCLUIR: teacherId: this.data.teacherId,
    };

    console.log('📤 Datos a enviar:', result);
    console.log('📊 Rating mostrado:', this.rating());
    console.log('📊 Rating real:', this.actualRating());

    this.dialogRef.close(result);
  }
  cancel() {
    this.dialogRef.close();
  }

  clearSearch() {
    this.searchQuery.set('');
  }
}
