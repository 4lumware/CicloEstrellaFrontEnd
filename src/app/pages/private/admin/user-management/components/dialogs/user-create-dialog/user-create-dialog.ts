import { Component, Inject, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  Select,
  Option as SelectOption,
} from '../../../../../../../components/forms/select/select';
import { Input } from '../../../../../../../components/forms/input/input';
import { RolesService } from '../../../../../../../services/roles/roles';
import { CareerService } from '../../../../../../../services/careers/career-service';
import { ImageService } from '../../../../../../../services/images/image-service';
import { Role } from '../../../../../../../models/users/user';

type CreateDialogData = {};

@Component({
  selector: 'app-user-create-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    Select,
    Input,
  ],
  templateUrl: './user-create-dialog.html',
  styleUrl: './user-create-dialog.css',
})
export class UserCreateDialog implements OnInit {
  title = computed(() => 'Agregar Usuario');

  form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    role: new FormControl<number | null>(null, { validators: [Validators.required] }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    profilePictureUrl: new FormControl<string>(''),
    // student fields
    currentSemester: new FormControl<number | null>(null),
    careerIds: new FormControl<number[]>([]),
  });

  protected roleOptions = signal<SelectOption[]>([]);
  protected careerOptions = signal<SelectOption[]>([]);
  protected profileImagePreview = signal<string | null>(null);
  protected selectedFile = signal<File | null>(null);

  protected semesterOptions: SelectOption[] = [
    { label: '1er Semestre', value: 1 },
    { label: '2do Semestre', value: 2 },
    { label: '3er Semestre', value: 3 },
    { label: '4to Semestre', value: 4 },
    { label: '5to Semestre', value: 5 },
    { label: '6to Semestre', value: 6 },
    { label: '7mo Semestre', value: 7 },
    { label: '8vo Semestre', value: 8 },
    { label: '9no Semestre', value: 9 },
    { label: '10mo Semestre', value: 10 },
  ];

  protected selectedRoleName = signal<string>('');
  protected isStudent = computed(() => this.selectedRoleName() === 'STUDENT');

  private dialogRef = inject(MatDialogRef<UserCreateDialog, any>);
  private data = inject<Readonly<CreateDialogData>>(MAT_DIALOG_DATA);
  private rolesService = inject(RolesService);
  private careerService = inject(CareerService);
  private imageService = inject(ImageService);

  private buildImageUrl(url: string | undefined): string | null {
    return this.imageService.buildImageUrl(url);
  }

  constructor() {
    // Load all roles for creation
    this.rolesService.index().subscribe({
      next: (response) => {
        const options = (response.data as Role[]).map((r) => ({ label: r.roleName, value: r.id }));
        this.roleOptions.set(options);
      },
    });

    this.careerService.index().subscribe({
      next: (careers) => this.careerOptions.set(careers),
    });

    // track role selection to toggle student fields
    this.form.controls.role.valueChanges.subscribe((roleId) => {
      const selected = this.roleOptions().find((r) => r.value === roleId);
      this.selectedRoleName.set(selected?.label || '');
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) return;
      if (file.size > 2 * 1024 * 1024) return;
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = (e) => this.profileImagePreview.set(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile.set(null);
    this.profileImagePreview.set(null);
    this.form.controls.profilePictureUrl.setValue('');
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();

    const selectedRole = this.roleOptions().find((r) => r.value === v.role);
    const roleName = selectedRole?.label || '';

    const payload: any = {
      username: v.username,
      email: v.email,
      roleName,
    };

    if (v.role) payload.roleId = v.role as number;
    if (this.selectedFile()) payload.profilePictureUrl = this.profileImagePreview();
    else if (v.profilePictureUrl) payload.profilePictureUrl = v.profilePictureUrl;

    // password required on create
    if (v.password && v.password.trim() !== '') payload.password = v.password;
    else return;

    if (this.isStudent()) {
      if (!v.currentSemester || v.currentSemester < 1 || v.currentSemester > 20) return;
      if (!v.careerIds || !Array.isArray(v.careerIds) || v.careerIds.length === 0) return;
      payload.currentSemester = v.currentSemester;
      payload.careerIds = v.careerIds;
    }

    this.dialogRef.close(payload);
  }
}
