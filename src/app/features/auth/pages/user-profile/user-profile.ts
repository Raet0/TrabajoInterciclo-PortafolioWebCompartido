import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Drawer } from "../../components/drawer/drawer";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Drawer
],
  templateUrl: './user-profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfile implements OnInit {

  profileForm!: FormGroup;
  currentUser: any = null;
  isEditing = false;
  selectedFile: File | null = null;
  photoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.loadUserData();
  }

  loadUserData(): void {
    // MOCK DATA (reemplazar por AuthService / UserService)
    this.currentUser = {
      uid: '123',
      displayName: 'Nuevo Usuario',
      email: 'usuario@ejemplo.com',
      role: 'USUARIO',
      photoURL: 'assets/default-avatar.png'
    };

    this.profileForm.patchValue({
      displayName: this.currentUser.displayName
    });

    this.photoPreview = this.currentUser.photoURL;

    this.cdr.markForCheck();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    if (!this.isEditing) {
      this.loadUserData();
    }

    this.cdr.markForCheck();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const updatedData = this.profileForm.value;

    console.log('Datos a actualizar:', updatedData);

    if (this.selectedFile) {
      console.log('Nueva foto seleccionada:', this.selectedFile);
    }

    // Aquí iría tu llamada real al backend
    // userService.updateProfile(...)

    alert('Simulación: perfil actualizado correctamente');

    this.isEditing = false;
    this.cdr.markForCheck();
  }
}
