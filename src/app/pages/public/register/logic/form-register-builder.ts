import { FormBuilder, NonNullableFormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

import { passwordMatchOnControl } from '../components/form-register/form-register';
export function buildFormRegister(formBuilder: NonNullableFormBuilder): FormGroup {
  return formBuilder.group({
    account: formBuilder.group({
      name: formBuilder.control('', {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      email: formBuilder.control('', {
        validators: [Validators.required, Validators.email],
      }),
    }),
    academic: formBuilder.group({
      career: formBuilder.control<number | null>(null, {
        validators: [Validators.required],
      }),
      term: formBuilder.control<number | null>(null, {
        validators: [Validators.required],
      }),
      password: formBuilder.control('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      repeatPassword: formBuilder.control('', {
        validators: [Validators.required, Validators.minLength(6), passwordMatchOnControl],
      }),
    }),
    profile: formBuilder.group({
      profilePictureUrl: formBuilder.control(''),
      acceptConditions: formBuilder.control(false, {
        validators: [Validators.requiredTrue],
      }),
    }),
  });
}
