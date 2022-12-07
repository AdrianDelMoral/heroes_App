import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  constructor(private router: Router,
    private authService: AuthService) { }

  login() {
    // Ir al backend
    // un usuario
    this.authService.login()
      .subscribe(resp => {
        // console.log(resp); // se verá la información del usuario que queremos logear
        if (resp.id) {
          this.router.navigate(['./heroes']); // si existe el usuario... entrará a esta ruta
        }
      })
  }
  
  
  ingresarSinLogin() {
    this.authService.logout();
    this.router.navigate(['./heroes']);
  }
}
