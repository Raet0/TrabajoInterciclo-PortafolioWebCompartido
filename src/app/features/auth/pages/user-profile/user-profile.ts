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
import { AuthService } from '../../../../core/services/firebase/auth';
import { UserService } from '../../../../core/services/user.service';
import { switchMap } from 'rxjs';

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
  currentUser: any = null; // usuario cargado de Firebase
  isEditing = false;
  selectedFile: File | null = null;
  photoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]]
    });

    // Esperar a que AuthService esté inicializado
    this.authService.waitForAuth().then(() => {
      const uid = this.authService.currentUser()?.uid;
      if (uid) {
        this.loadUserData(uid);

      }
    });
  }

  async loadUserData(uid: string): Promise<void> {
    const profile = await this.userService.getUserProfile(uid);
    if (!profile) return;

    this.currentUser = profile;
    this.profileForm.patchValue({
      displayName: profile.nombre
    });
    console.log(profile)
    this.currentUser.displayName = profile.nombre

    this.photoPreview = (profile as any).photoURL || 'assets/default-avatar.png';

    this.cdr.markForCheck();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    if (!this.isEditing && this.currentUser) {
      this.profileForm.patchValue({ displayName: this.currentUser.nombre });
    }

    this.cdr.markForCheck();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(this.selectedFile);
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid || !this.currentUser) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const updatedData = {
      nombre: this.profileForm.value.displayName
    };

    // Guardar en Firestore
    await this.userService.setUserProfile(this.currentUser.uid, updatedData);


    // Para la foto, si quieres subir a Storage deberías agregarlo aquí
    // por ejemplo:
    // if (this.selectedFile) { ... subir a Firebase Storage ... }

    alert('Perfil actualizado correctamente');
    this.isEditing = false;
    this.loadUserData(this.currentUser.uid); // recargar datos
    this.cdr.markForCheck();
  }
}
