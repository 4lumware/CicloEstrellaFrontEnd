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
import { Students } from '../../../../../../../services/students/rest/students';
import { ImageService } from '../../../../../../../services/images/image-service';
import { Role } from '../../../../../../../models/users/user';

type UserDTO = {
  id?: number;
  username: string;
  email: string;
  creationDate: Date;
  state: boolean;
  roles: { id: number; roleName: string }[];
  profilePictureUrl?: string;
  currentSemester?: number;
  careerIds?: number[];
};

type UpdateDialogData = { user: UserDTO };

@Component({
  selector: 'app-user-update-dialog',
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
  templateUrl: './user-update-dialog.html',
  styleUrl: './user-update-dialog.css',
})
export class UserUpdateDialog implements OnInit {
  title = computed(() => 'Editar Usuario');

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
    createdAt: new FormControl<Date | null>(null),
    password: new FormControl('', { nonNullable: true, validators: [Validators.minLength(6)] }),
    profilePictureUrl: new FormControl<string>(''),
    currentSemester: new FormControl<number | null>(null),
    careerIds: new FormControl<number[]>([]),
  });

  protected roleOptions = signal<SelectOption[]>([]);
  protected careerOptions = signal<SelectOption[]>([]);
  protected profileImagePreview = signal<string | null>(null);
  protected selectedFile = signal<File | null>(null);

  protected selectedRoleName = signal<string>('');
  protected isStudent = computed(() => this.selectedRoleName() === 'STUDENT');
  protected isStaff = computed(() =>
    ['ADMIN', 'MODERATOR', 'WRITER'].includes(this.selectedRoleName())
  );

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

  private dialogRef = inject(MatDialogRef<UserUpdateDialog, any>);
  private data = inject<Readonly<UpdateDialogData>>(MAT_DIALOG_DATA);
  private rolesService = inject(RolesService);
  private careerService = inject(CareerService);
  private studentService = inject(Students);
  private imageService = inject(ImageService);

  ngOnInit(): void {
    const u = this.data.user;

    // Load all roles first
    this.rolesService.index().subscribe({
      next: (response) => {
        const options = (response.data as Role[]).map((r) => ({ label: r.roleName, value: r.id }));
        this.roleOptions.set(options);
        this.applyRoleFiltering(u.roles?.[0]?.roleName || '');
      },
    });

    this.careerService.index().subscribe({ next: (careers) => this.careerOptions.set(careers) });

    // Initialize form values
    const roleId = u.roles && u.roles.length ? u.roles[0].id : null;
    const roleName = u.roles && u.roles.length ? u.roles[0].roleName : '';
    if (roleId) {
      this.form.controls.role.setValue(roleId);
      this.selectedRoleName.set(roleName);
    }
    this.form.patchValue({
      username: u.username,
      email: u.email,
      createdAt: u.creationDate ? new Date(u.creationDate) : null,
      profilePictureUrl: u.profilePictureUrl || '',
    });

    if (u.profilePictureUrl) {
      const full = this.imageService.buildImageUrl(u.profilePictureUrl);
      if (full) this.profileImagePreview.set(full);
    }

    // If student, load full data
    if (roleName === 'STUDENT' && u.id) {
      this.studentService.getById(u.id).subscribe({
        next: (response) => {
          const studentData = response.data || response;
          if (studentData.currentSemester)
            this.form.controls.currentSemester.setValue(studentData.currentSemester);
        },
      });
    }

    // Track role changes
    this.form.controls.role.valueChanges.subscribe((roleId) => {
      const selected = this.roleOptions().find((r) => r.value === roleId);
      if (selected) this.selectedRoleName.set(selected.label);
    });
  }

  private applyRoleFiltering(originalRoleName: string): void {
    const currentOptions = this.roleOptions();
    if (originalRoleName === 'STUDENT') {
      // Student cannot change role
      const onlyStudent = currentOptions.filter((o) => o.label === 'STUDENT');
      this.roleOptions.set(onlyStudent);
      this.form.controls.role.disable({ emitEvent: false });
    } else {
      // Staff can only choose staff roles
      const staffRoleNames = ['ADMIN', 'MODERATOR', 'WRITER'];
      const staffOnly = currentOptions.filter((o) => staffRoleNames.includes(o.label));
      this.roleOptions.set(staffOnly);
      this.form.controls.role.enable({ emitEvent: false });
      const currentValue = this.form.controls.role.value;
      const exists = staffOnly.some((o) => o.value === currentValue);
      if (!exists) this.form.controls.role.setValue(null, { emitEvent: false });
    }
  }

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

    if (v.password && v.password.trim() !== '') payload.password = v.password;

    // Student-specific
    if (this.isStudent()) {
      if (!v.currentSemester || v.currentSemester < 1 || v.currentSemester > 10) return;
      if (!v.careerIds || !Array.isArray(v.careerIds) || v.careerIds.length === 0) return;
      payload.currentSemester = v.currentSemester;
      payload.careerIds = v.careerIds;
    }

    // Flags for conversion logic in parent
    const originalRole =
      this.data.user.roles && this.data.user.roles.length ? this.data.user.roles[0].roleName : '';
    payload.wasStudent = originalRole === 'STUDENT';
    payload.originalUserId = this.data.user.id;

    this.dialogRef.close(payload);
  }
}
