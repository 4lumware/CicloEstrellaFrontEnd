import { Component, Inject, OnInit, Signal, computed, inject, signal } from '@angular/core';
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
import { toSignal } from '@angular/core/rxjs-interop';
import { RolesService } from '../../../../../../../services/roles/roles';
import { CareerService } from '../../../../../../../services/careers/career-service';
import { Students } from '../../../../../../../services/students/students';
import { ImageService } from '../../../../../../../services/images/image-service';
import { map } from 'rxjs';
import { Role } from '../../../../../../../models/users/user';

type UserDTO = {
  id?: number;
  username: string;
  email: string;
  creationDate: Date;
  state: boolean;
  roles: { id: number; roleName: string }[];
  profilePictureUrl?: string;
  // Student fields
  currentSemester?: number;
  careerIds?: number[];
};

export type UserFormDialogData = {
  mode: 'create' | 'edit' | 'update';
  user?: UserDTO;
};

@Component({
  selector: 'app-user-form-dialog',
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
  templateUrl: './user-form-dialog.html',
  styleUrl: './user-form-dialog.css',
})
export class UserFormDialog implements OnInit {
  title = computed(() => (this.data.mode === 'create' ? 'Agregar Usuario' : 'Editar Usuario'));
  isEditMode = computed(() => this.data.mode === 'edit' || this.data.mode === 'update');

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
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.minLength(6)], // No required por defecto, se valida en onSubmit
    }),
    profilePictureUrl: new FormControl<string>(''),

    // Student fields
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
  protected isStaff = computed(() =>
    ['ADMIN', 'MODERATOR', 'WRITER'].includes(this.selectedRoleName())
  );

  private dialogRef = inject(MatDialogRef<UserFormDialog, Partial<UserDTO> | null>);
  private data = inject<Readonly<UserFormDialogData>>(MAT_DIALOG_DATA);
  private rolesService = inject(RolesService);
  private careerService = inject(CareerService);
  private studentService = inject(Students);
  private imageService = inject(ImageService);

  private buildImageUrl(url: string | undefined): string | null {
    return this.imageService.buildImageUrl(url);
  }

  constructor() {
    // Cargar roles
    this.rolesService.index().subscribe({
      next: (response) => {
        const options = response.data;

        const selectedOptions = options.map((role: Role) => ({
          label: role.roleName,
          value: role.id,
        }));

        this.roleOptions.set(selectedOptions);
      },
    });

    // Cargar carreras
    this.careerService.index().subscribe({
      next: (careers) => {
        console.log('Carreras cargadas:', careers);
        this.careerOptions.set(careers);
      },
      error: (err) => {
        console.error('Error al cargar carreras:', err);
      },
    });

    // Escuchar cambios en el rol seleccionado
    this.form.controls.role.valueChanges.subscribe((roleId) => {
      const selectedRole = this.roleOptions().find((r) => r.value === roleId);
      if (selectedRole) {
        this.selectedRoleName.set(selectedRole.label);
        this.updateValidators();
      }
    });

    // Debug: monitorear cambios en careerIds
    this.form.controls.careerIds.valueChanges.subscribe((value) => {
      console.log(
        'careerIds cambió a:',
        value,
        'Tipo:',
        typeof value,
        'Es array:',
        Array.isArray(value)
      );
    });
  }

  ngOnInit(): void {
    if ((this.data.mode === 'edit' || this.data.mode === 'update') && this.data.user) {
      const u = this.data.user as UserDTO;

      // Establecer el rol primero para que se actualicen los validadores
      const roleId = u.roles && u.roles.length ? u.roles[0].id : null;
      const roleName = u.roles && u.roles.length ? u.roles[0].roleName : '';

      if (roleId) {
        this.form.controls.role.setValue(roleId);
        this.selectedRoleName.set(roleName);
        this.updateValidators();
      }

      // Cargar datos básicos del usuario
      this.form.patchValue({
        username: u.username,
        email: u.email,
        createdAt: u.creationDate ? new Date(u.creationDate) : null,
        profilePictureUrl: u.profilePictureUrl || '',
      });

      // Si hay una imagen de perfil, construir la URL completa y mostrarla
      if (u.profilePictureUrl) {
        const fullImageUrl = this.buildImageUrl(u.profilePictureUrl);
        if (fullImageUrl) {
          this.profileImagePreview.set(fullImageUrl);
        }
      }

      // Si es estudiante, cargar todos sus datos desde el backend
      if (roleName === 'STUDENT' && u.id) {
        this.studentService.getById(u.id).subscribe({
          next: (response) => {
            console.log('Datos completos del estudiante:', response);
            const studentData = response.data || response;

            // Cargar datos específicos de estudiante
            if (studentData.currentSemester) {
              this.form.controls.currentSemester.setValue(studentData.currentSemester);
            }

            if (studentData.careerIds && studentData.careerIds.length > 0) {
              this.form.controls.careerIds.setValue(studentData.careerIds);
            } else if (studentData.careers && Array.isArray(studentData.careers)) {
              // Si viene un array de objetos carrera, extraer los IDs
              const careerIds = studentData.careers.map((c: any) => c.id);
              this.form.controls.careerIds.setValue(careerIds);
            }
          },
          error: (err) => {
            console.error('Error al cargar datos del estudiante:', err);
            // Si falla, intentar usar los datos que vienen en el usuario
            if (u.currentSemester) {
              this.form.controls.currentSemester.setValue(u.currentSemester);
            }
            if (u.careerIds && u.careerIds.length > 0) {
              this.form.controls.careerIds.setValue(u.careerIds);
            }
          },
        });
      } else {
        // Para no estudiantes, usar los datos que vienen en el usuario (si los hay)
        if (u.currentSemester) {
          this.form.controls.currentSemester.setValue(u.currentSemester);
        }
        if (u.careerIds && u.careerIds.length > 0) {
          this.form.controls.careerIds.setValue(u.careerIds);
        }
      }
    }
  }
  onCancel(): void {
    this.dialogRef.close(null);
  }

  private updateValidators(): void {
    const currentSemesterCtrl = this.form.controls.currentSemester;
    const careerIdsCtrl = this.form.controls.careerIds;

    if (this.isStudent()) {
      // Student: requerir semestre y carreras
      currentSemesterCtrl.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(20),
      ]);
      careerIdsCtrl.setValidators([Validators.required, Validators.minLength(1)]);
    } else {
      // No student: limpiar validaciones
      currentSemesterCtrl.clearValidators();
      careerIdsCtrl.clearValidators();
      currentSemesterCtrl.setValue(null);
      careerIdsCtrl.setValue([]);
    }

    currentSemesterCtrl.updateValueAndValidity();
    careerIdsCtrl.updateValueAndValidity();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor seleccione una imagen válida');
        return;
      }

      // Validar tamaño (máx 2MB para mantener dentro del límite de 1000 chars en URL)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen no debe superar 2MB');
        return;
      }

      this.selectedFile.set(file);

      // Crear preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImagePreview.set(e.target?.result as string);
      };
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

    let payload: any = {
      username: v.username,
      email: v.email,
      roleName: roleName,
    };

    // Incluir roleId para todos los roles (staff y student)
    if (v.role) {
      payload.roleId = v.role as number;
    }

    // Manejar profilePictureUrl
    if (this.selectedFile()) {
      // Si hay un nuevo archivo seleccionado, usar el base64
      payload.profilePictureUrl = this.profileImagePreview();
    } else if (v.profilePictureUrl) {
      // Si no hay nuevo archivo pero había una URL previa, mantener la original (no la construida)
      // Esto es importante para no enviar la URL completa al servidor
      payload.profilePictureUrl = v.profilePictureUrl;
    }

    // Incluir password si se proporciona
    if (v.password && v.password.trim() !== '') {
      payload.password = v.password;
    } else if (!this.isEditMode()) {
      // En modo creación, el password es obligatorio
      alert('La contraseña es requerida para crear un nuevo usuario');
      return;
    }

    // Para estudiantes, agregar campos específicos
    if (this.isStudent()) {
      // Validar que currentSemester esté presente
      if (!v.currentSemester || v.currentSemester < 1 || v.currentSemester > 20) {
        alert('Debe seleccionar un semestre válido (1-20)');
        return;
      }

      // Validar que careerIds tenga al menos una carrera
      if (!v.careerIds || !Array.isArray(v.careerIds) || v.careerIds.length === 0) {
        alert('Debe seleccionar al menos una carrera');
        return;
      }

      payload.currentSemester = v.currentSemester;
      payload.careerIds = v.careerIds;

      console.log('Datos de estudiante:', {
        currentSemester: v.currentSemester,
        careerIds: v.careerIds,
        careerIdsLength: v.careerIds.length,
      });
    }

    // Indicar si el usuario original era estudiante (para conversión a staff/admin)
    if (this.isEditMode() && this.data.user) {
      const originalRole =
        this.data.user.roles && this.data.user.roles.length ? this.data.user.roles[0].roleName : '';
      payload.wasStudent = originalRole === 'STUDENT';
      payload.originalUserId = this.data.user.id;
    }

    console.log('Payload final del dialog:', payload);
    this.dialogRef.close(payload);
  }
}
